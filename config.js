'use strict';

const config = {
  // deamon 重启间隔时间
  rebootInterval: 1000 * 10,

  // 抓取最小时间
  minDate: new Date('2018/7/1'),

  // http timeout
  httpTimeout: 1000 * 10,

  // cookie
  cookie: '',

  // 防 ban 随机 sleep
  sleepInterval: {
    base: 1000,
    random: 2000,
  },

  // 多久之内不重新爬同一网页
  spiderTimeInterval: 1000 * 60 * 60 * 24 * 2,

  // 是否使用代理
  useProxy: false,

  // 是否全部使用代理ip抓取
  allByProxy: false,

  // 抓取目标
  targetUri: [
    'https://weibo.cn/u/2804414062',
    'https://weibo.cn/u/6239620007',
  ],

  // 发送邮件的方法
  sendMail: () => {},
};

// 忽略下面的代码
try {
  const myConfig = require('./my_config');
  const fn = (a, b) => {
    const keys  = Object.keys(a);
    keys.forEach(k => {
      if (b.hasOwnProperty(k)) {
        if (Object.prototype.toString.call(b[k]) === '[object Object]') {
          fn(a[k], b[k]);
        } else {
          a[k] = b[k];
        }
      }
    });
  };
  fn(config, myConfig);
} catch(e) {
  // console.log(e);
  // Do nothing
}

module.exports = config;
