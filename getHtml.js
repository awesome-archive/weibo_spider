'use strict';

const fs = require('fs');
const rp = require('request-promise');

const { httpTimeout, allByProxy, useProxy, cookie } = require('./config');

let ipPool = [];
if (useProxy) {
  try {
    ipPool = fs.readFileSync('./ippool.txt', 'utf8').trim().split('\n');
  } catch (e) {
    // console.log(e);
  }
}

async function getHtml(uri) {

  if (!uri) throw new Error('请传入uri参数');

  const options = {
    uri,
    headers: { Cookie: cookie },
  };

  // 代理设置
  if (useProxy && ipPool.length) {

    // 设置代理ip
    const setProxy = (index) => {
      let proxy = ipPool[index];
      if (!/^http/.test(proxy)) proxy = 'http://' + proxy;
      options.proxy = proxy;
    };

    if (allByProxy) {
      const randomIndex = Math.floor(Math.random() * ipPool.length);
      setProxy(randomIndex);
    } else {
      const randomIndex = Math.floor(Math.random() * (ipPool.length + 1));
      // 如果随机数等于length，则代表不设置代理
      if (randomIndex < ipPool.length) {
        setProxy(randomIndex);
      }
    }
  }

  // console.log();
  // console.log('request options', options);
  // console.log();

  try {
    const html = await Promise.race([
      new Promise(resolve => {
        setTimeout(resolve, httpTimeout);
      }),
      rp(options)
    ]);
    if (html) return html;
    return await getHtml(uri);
  } catch (e) {
    throw e;
  }
}

module.exports = getHtml;
