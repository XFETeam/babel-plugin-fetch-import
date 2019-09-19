const babelType = require('babel-types');
const template = require('babel-template');
const request = require('sync-request');
const {readCache, writeCache} = require('./cache/index');
const createLog = require('./log');

const log = createLog();
const FETCH_SCHEMA = /^FETCH:/;
const MODULE_SCHEMA = /^MODULE:/;

const getAbrContent = (content) => {
  return content.length > 100 ? `${content.slice(-50)} ...... ${content.slice(-50)}` : content;
};

const fetch = (url) => {
  let {content, filename, cwdRelativeFilename} = readCache(url);
  if (!content) {
    content = request('GET', url).getBody().toString();
    const {filename} = writeCache({url, content});
    log(`new fetch, fetch url = ${url}, store filename = ${filename}, content = ${getAbrContent(content)}`);
  } else {
    log(`cache hit, cache url = ${url}, store filename = ${filename}, content = ${getAbrContent(content)}`);
  }
  return {url, content, filename, cwdRelativeFilename};
};

const fetchTemplate = template(`
    var LOCAL = MODULE_NAME;
`);

const moduleTemplate = template(`
    var LOCAL = require(MODULE_NAME);
`);

let specifiers = [];

const specifierVisitor = {
  ImportNamespaceSpecifier(_path) {
    let data = {
      type: 'NAMESPACE',
      local: _path.node.local.name
    };

    this.specifiers.push(data);
  },

  ImportSpecifier(_path) {
    let data = {
      type: 'COMMON',
      local: _path.node.local.name,
      imported: _path.node.imported ? _path.node.imported.name : null
    };

    this.specifiers.push(data);
  },

  ImportDefaultSpecifier(_path) {
    let data = {
      type: 'DEFAULT',
      local: _path.node.local.name
    };

    this.specifiers.push(data);
  }
};

function constructFetchSyncRequire({type, moduleName, local}) {
  let declaration;
  switch (type) {
    case 'NAMESPACE':
    case 'COMMON':
    case 'DEFAULT':
    case 'SIDE':
      const {content} = fetch(moduleName);
      const MODULE_NAME = babelType.stringLiteral(content);
      declaration = fetchTemplate({
        LOCAL: babelType.identifier(local),
        MODULE_NAME: MODULE_NAME
      });
      break;
    default:
      throw new Error('babel-plugin-http-import: unexpected scenario');
  }
  return declaration;
}

function constructModuleSyncRequire({type, moduleName, local}) {
  let declaration;
  switch (type) {
    case 'NAMESPACE':
    case 'COMMON':
    case 'DEFAULT':
    case 'SIDE':
      const {cwdRelativeFilename} = fetch(moduleName);
      const MODULE_NAME = babelType.stringLiteral(cwdRelativeFilename);
      declaration = moduleTemplate({
        LOCAL: babelType.identifier(local),
        MODULE_NAME: MODULE_NAME
      });
      break;
    default:
      throw new Error('babel-plugin-http-import: unexpected scenario');
  }
  return declaration;
}

// noinspection JSUnusedGlobalSymbols
export const visitor = {
  ImportDeclaration: {
    enter(path) {
      path.traverse(specifierVisitor, {specifiers});
    },
    exit(path) {
      let moduleName = path.node.source.value;
      // noinspection JSUnresolvedFunction
      if (babelType.isStringLiteral(path.node.source)) {
        /**
         * 处理关于 import * as zepto from 'FETCH:https://cdn.bootcss.com/zepto/1.0rc1/zepto.min.js'; 的场景
         */
        if (FETCH_SCHEMA.test(moduleName)) {
          moduleName = moduleName.replace(FETCH_SCHEMA, '');
          let nodes;
          if (specifiers.length === 0) {
            nodes = constructFetchSyncRequire({
              moduleName,
              type: 'COMMON'
            });
            nodes = [nodes]
          } else {
            nodes = specifiers.map(s => {
              s['moduleName'] = moduleName;
              return constructFetchSyncRequire(s);
            });
          }
          // noinspection JSUnresolvedFunction
          path.replaceWithMultiple(nodes);
        }
        /**
         * 处理关于 import * as zepto from 'MODULE:http://zhcdn01.xoyo.com/xassets/lib/meta-flexible/0.0.8/meta-flexible.min.js'; 的场景
         */
        else if (MODULE_SCHEMA.test(moduleName)) {
          moduleName = moduleName.replace(MODULE_SCHEMA, '');
          let nodes;
          if (specifiers.length === 0) {
            nodes = constructModuleSyncRequire({
              moduleName,
              type: 'COMMON'
            });
            nodes = [nodes]
          } else {
            nodes = specifiers.map(s => {
              s['moduleName'] = moduleName;
              return constructModuleSyncRequire(s);
            });
          }
          // noinspection JSUnresolvedFunction
          path.replaceWithMultiple(nodes);
        }
      }
      specifiers = [];
    }
  }
};
