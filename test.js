'use strict';

const getWeibo = require('./getWeiboCn').getWeibo;

let profile = {
  uri: 'https://weibo.cn/u/1892723783',
  _id: '59d5cd4ea2da863d7f7ed2ba'
};

getWeibo(profile, 19).then(() => {
  console.log('done');
});