'use strict';

// weibo.cn html parse
const getWeiboCn = require('./getWeiboCn');
let targetUri = require('./targetUri');


// 串行
let p = Promise.resolve();
while (targetUri.length) {
  let target = targetUri.shift();
  p = p.then(() => {
    return getWeiboCn(target, new Date(2017, 6, 1));
  }).then(() => {
    console.log(`\n${target} is done. 剩余 ${targetUri.length} 条.\n`);
  });
}

p = p.then(() => {
  console.log('done');
});



// 并行
// Promise.all(targetUri.map(target => {
//   return getWeiboCn(target, new Date(2017, 6, 1));
// })).then(() => {
//   console.log('done');
// });



// const moment = require('moment');
// // weibo restful json api
// const getWeibo = require('./getWeibo');
// const targets = require('./targets');

// // getWeibo(link, moment('2017-09-01').toDate()).then(() => {
// //   console.log('done');
// // });

// Promise.all(targets.map(link => {
//   return getWeibo(link);
// })).then(() => {
//   console.log('done');
// })