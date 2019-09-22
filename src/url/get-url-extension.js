const path = require('path');

/**
 * 获取地址 url 后缀
 * @param httpUrl
 * @returns {string}
 */
function getUrlExtension(httpUrl) {
  const url = new URL(httpUrl);
  const searchParamExtension = url.searchParams.get('__extension');
  const fileExtension = path.extname(url.pathname);
  if (fileExtension) {
    return fileExtension;
  }
  return searchParamExtension ? `.${searchParamExtension}` : '';
}

module.exports = getUrlExtension;
