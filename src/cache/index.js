const md5 = require('md5');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const {name: packageName} = require('../../package.json');

const safeHash = (message) => md5(message).replace(/[+/]/, '_');
const cacheDirectory = path.resolve(process.cwd(), `node_modules/.cache/${packageName}`);
const resolveCachePath = (filename) => path.resolve(cacheDirectory, filename);

/**
 * 创建缓存目录
 */
function createCacheDirectoryOnce() {
  mkdirp.sync(cacheDirectory);
  createCacheDirectoryOnce = f => f;
}

/**
 * 获取缓存文件名
 * @param url
 * @returns {string}
 */
function getCacheFilename(url) {
  createCacheDirectoryOnce();
  return resolveCachePath(safeHash(url));
}

/**
 * 写缓存
 * @param url
 * @param content
 * @returns {{filename: string, content: *}}
 */
function writeCache({url, content}) {
  const filename = getCacheFilename(url);
  fs.writeFileSync(filename, content);
  return {filename, content};
}

/**
 * 获取基于 node_modules 的相对路径
 */
function getPathRelativeToNodeModules(currentPath) {
  const nodeModulePath = path.resolve(process.cwd(), 'node_modules');
  return path.relative(nodeModulePath, currentPath);
}

/**
 * 读缓存
 * @param url
 * @returns {{filename: string, content: string}|{}}
 */
function readCache(url) {
  try {
    const filename = getCacheFilename(url);
    const content = fs.readFileSync(filename).toString();
    const cwdRelativeFilename = getPathRelativeToNodeModules(filename);
    return {filename, content, cwdRelativeFilename};
  } catch (e) {
    return {};
  }
}

module.exports = {
  writeCache,
  readCache
};
