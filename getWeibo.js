'use strict';

const url = require('url');
const axios = require('axios');
const moment = require('moment');
const models = require('./models');

const { WeiboPost } = models;

// basic mobile link to api link
function tranLink(link) {
  return new Promise((resolve, reject) => {
    // 兼容直接api接口链接
    if (/m.weibo.cn\/api\/container\/getIndex/.test(link)) return resolve(link);
    let o = url.parse(link);
    if (o.hostname == 'm.weibo.cn') {
      if (/\/p\/\d{16}/.test(o.pathname)) {
        let cid = /\/p\/(\d{16})/.exec(o.pathname)[1].replace('100505', '107603');
        let targetLink = 'https://m.weibo.cn/api/container/getIndex?containerid=' + cid + '&page=';
        resolve(targetLink);
      } else if (/\/u\/\d{10}/.test(o.pathname)) {
        let cid = /\/u\/(\d{10})/.exec(o.pathname)[1];
        cid = '107603' + cid;
        let targetLink = 'https://m.weibo.cn/api/container/getIndex?containerid=' + cid + '&page=';
        resolve(targetLink);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

function saveOrUpdataToDb(post) {
  return WeiboPost.findOne({ scheme: post.scheme }).then(item => {
    if (item) {
      return WeiboPost.findByIdAndUpdate(item._id, post);
    } else {
      let item = new WeiboPost(post);
      return item.save();
    }
  });
}

function requestAndParseData(link, page) {
  return axios.get(`${link}${page}`).then(res => {
    return res.data;
  }).then(data => {
    let content = data.cards;
    let posts = [];
    for (let i=0, len=content.length; i<len; i++){
      let item = content[i];
      let cardType = item.card_type;
      if (cardType == '9') {
        // 日期格式转换: 4分钟前 / 2小时前 / 昨天... / 09-12 / 2016-09-12
        let postCreatedAt = item.mblog.created_at;
        let startOfDay = moment().startOf('day').toDate();
        if (/^\d{4}-\d\d-\d\d$/.test(postCreatedAt)) {
          postCreatedAt = moment(postCreatedAt).toDate();
        } else if (/^\d\d-\d\d$/.test(postCreatedAt)) {
          postCreatedAt = moment(`${moment().get('year')}-${postCreatedAt}`).toDate();
        } else if (/昨天/.test(postCreatedAt)) {
          postCreatedAt = moment(startOfDay - 24 * 60 * 60 * 1000).toDate();
        } else if (/小时前/.test(postCreatedAt)) {
          let nowHour = moment().hour();
          let hour = parseInt(postCreatedAt.replace('小时前', ''));
          if (hour > nowHour) {
            postCreatedAt = moment(startOfDay - 24 * 60 * 60 * 1000).toDate();
          } else {
            postCreatedAt = startOfDay;
          }
        } else {
          postCreatedAt = startOfDay;
        }
        let post = {
          itemId: item.itemid,
          scheme: item.scheme,
          screenName: item.mblog.user.screen_name,
          text: item.mblog.text,
          source: item.mblog.source,
          postCreatedAt: postCreatedAt,
          repostsCount: item.mblog.reposts_count,
          commentsCount: item.mblog.comments_count,
          attitudesCount: item.mblog.attitudes_count,
          followersCount: item.mblog.user.followers_count,
          followCount: item.mblog.user.follow_count
        };
        posts.push(post);
      }
    }
    return posts;
  });
}

function main(link, page) {
  page = page || 1;
  return tranLink(link).then(targetLink => {
    return requestAndParseData(targetLink, page);
  }).then(posts => {
    return Promise.all(posts.map(post => {
      return saveOrUpdataToDb(post);
    })).then(() => {
      let minDate;
      posts.forEach(post => {
        if (!minDate || minDate > post.postCreatedAt) {
          minDate = post.postCreatedAt;
        }
      });
      return minDate;
    });
  });
}

function proxyMain(link, minDate) {
  let count = 1;
  minDate = minDate || moment().toDate();
  return (function proxy(link, count) {
    return main(link, count).then(date => {
      if (minDate <= date) {
        return proxy(link, ++count);
      }
      return date;
    });
  })(link, count);
}

module.exports = proxyMain;
