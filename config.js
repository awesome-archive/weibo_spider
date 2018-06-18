'use strict';

module.exports = {
  // deamon 重启间隔时间
  rebootInterval: 1000 * 5,

  // 抓取最小时间
  minDate: new Date('2018-4-1'),

  // http timeout
  httpTimeout: 1000 * 10,

  // cookie
  cookie: '_T_WM=8af460d60530fca52a502160943d7ec3; ALF=1531800568; SCF=AnAseSisSVzWQVztOdjiYlmPoYBqAlfBkfFYGK4iyipDuzLpKM_BKCZfrx2C9ajBZTHFQl4zIJS2qfDhoQT8rJ0.; SUB=_2A252IldcDeRhGeVL6FQX8SjPwz-IHXVV7XkUrDV6PUJbktAKLXjTkW1NTFP2DxZ3F-LYdcwcioUHiNuzmDR-s5Mk; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5kGbmoeBxxfX5SF1NVW4pD5JpX5K-hUgL.Foefe0qceKq01he2dJLoI7LjIP8DMgLydJMt; SUHB=0U1JwBTSICH-X1; SSOLoginState=1529227020',

  // 防ban随机sleep
  sleepInterval: {
    base: 1000,
    random: 1500,
  },

  // 多久之内不重新爬同一网页
  spiderTimeInterval: 1000 * 60 * 60 * 24 * 2,

  // 是否全部使用代理ip抓取
  allByProxy: true,

  // 抓取目标
  targetUri: [
    'https://weibo.cn/u/3217179555',
    'https://weibo.cn/fenng',
  ]
};
