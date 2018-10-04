'use strict';

const fs = require('fs');
const getWeiboCn = require('./getWeiboCn');
const crawlHistory = require('./crawlHistory');
let { minDate, targetUri, sendMail } = require('./config');

async function reduceTarget() {
  for (let i = 0, len = targetUri.length; i < len; i++) {
    const target = targetUri[i];

    crawlHistory.clean();

    if (crawlHistory.shouldCrawl(target)) {
      await getWeiboCn(target, minDate);
    }

    crawlHistory.set(target);
    console.log(`\n${target}已抓取完成，剩余${len - 1 - i}条。\n`);
  }
  console.log('done');
  process.exit();
}

reduceTarget();

// 错误处理
const errHandler = (err) => {
  if (typeof sendMail === 'function') {
    sendMail(err.stack).then(() => {
      console.log('已发送错误邮件');
    }).catch(() => { }).then(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', err => {
  fs.appendFileSync('error.log', new Date().toLocaleString() + '\n' + err.stack + '\n\n', 'utf8');
  errHandler(err);
});

process.on('unhandledRejection', (reason, p) => {
  fs.appendFileSync('error.log', `${new Date().toLocaleString()}\n未处理的rejection: ${String(p)}\n原因:${reason.stack}\n\n`, 'utf8');
  errHandler(reason);
});
