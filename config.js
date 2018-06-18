'use strict';

module.exports = {
  // deamon 重启间隔时间
  rebootInterval: 1000 * 5,

  // 抓取最小时间
  minDate: new Date('2018-4-1'),

  // http timeout
  httpTimeout: 1000 * 10,

  // cookie
  cookie: '_T_WM=8af460d60530fca52a502160943d7ec3; ALF=1531904471; SCF=AnAseSisSVzWQVztOdjiYlmPoYBqAlfBkfFYGK4iyipDjNCzf3nF8Mk-YFGXe2_SFpFrvYmtjHtkbR0nCsHOgfc.; SUB=_2A252IwbyDeRhGeVL6FQX8SjPwz-IHXVV76q6rDV6PUJbktANLUHukW1NTFP2D56zZ2c_6YSDkgN6zVjNM_pPNyj-; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5kGbmoeBxxfX5SF1NVW4pD5JpX5K-hUgL.Foefe0qceKq01he2dJLoI7LjIP8DMgLydJMt; SUHB=0IIVjCoUwhbyVZ; SSOLoginState=1529312931',

  // 防ban随机sleep
  sleepInterval: {
    base: 1000,
    random: 1500,
  },

  // 多久之内不重新爬同一网页
  spiderTimeInterval: 1000 * 60 * 60 * 24 * 2,

  // 是否使用代理
  useProxy: true,

  // 是否全部使用代理ip抓取
  allByProxy: false,

  // 抓取目标
  targetUri: [
    'https://weibo.cn/u/3217179555',
    'https://weibo.cn/fenng',
  ]
};
