const assert = require('assert');
const getUrlExtension = require('../../src/url/get-url-extension.js');

describe('正常转换: 转成正确对应结果', () => {
  it(`期望: 正确解析 import "FETCH" 并下载 zepto, 最终返回下载完成的内容(字符串)`, (done) => {
    assert.deepStrictEqual(getUrlExtension('http://baidu.com'), '');
    assert.deepStrictEqual(getUrlExtension('http://baidu.com/haha.js'), '.js');
    assert.deepStrictEqual(getUrlExtension('http://baidu.com/aa/haha.js'), '.js');
    assert.deepStrictEqual(getUrlExtension('http://baidu.com/aa/haha.js?aa=123'), '.js');
    assert.deepStrictEqual(getUrlExtension('http://baidu.com/aa/haha?__extension=js'), '.js');
    assert.deepStrictEqual(getUrlExtension('http://baidu.com?__extension=js'), '.js');
    done();
  });
});
