import path from 'path';
import fs from 'fs';
import assert from 'assert';
import {transformFileSync} from 'babel-core';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('正常转换: 转成正确对应结果', () => {
  it(`期望: 正确解析 import "FETCH" 并下载 zepto, 最终返回下载完成的内容(字符串)`, (done) => {
    const fixtureDir = path.join(__dirname, 'fixtures/string');
    const actualPath = path.join(fixtureDir, 'actual.js');
    const actual = transformFileSync(actualPath).code;
    const expected = fs.readFileSync(
      path.join(fixtureDir, 'expected.js')
    ).toString();
    assert.deepStrictEqual(trim(actual), trim(expected));
    done();
  });
  it(`期望: 正确解析 import "MODULE" 并下载 react, 最终返回 react 对象`, (done) => {
    const fixtureDir = path.join(__dirname, 'fixtures/module');
    const actualPath = path.join(fixtureDir, 'actual.js');
    const actual = transformFileSync(actualPath).code;
    const expected = fs.readFileSync(
      path.join(fixtureDir, 'expected.js')
    ).toString();
    assert.deepStrictEqual(trim(actual), trim(expected));
    done();
  });
});
