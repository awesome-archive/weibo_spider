'use strict';

const moment = require('moment');
const getWeibo = require('./getWeibo');
const targets = require('./targets');

// getWeibo(link, moment('2017-09-01').toDate()).then(() => {
//   console.log('done');
// });

const targetProfile = targets.slice(0, 3);

Promise.all(targetProfile.map(link => {
  return getWeibo(link);
})).then(() => {
  console.log('done');
})