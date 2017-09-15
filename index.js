'use strict';

const url = require('url');
const axios = require('axios');
const util = require('util');
const WeiboPost = require('./models/WeiboPost');

// basic mobile link to api link
function tranLink(link) {
  return new Promise((resolve, reject) => {
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
  })
}

function saveOrUpdataToDb(post) {
  return WeiboPost.findOne({ itemId: post.itemId }).then(item => {
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
        let post = {
          itemId: item.itemid,
          scheme: item.scheme,
          screenName: item.mblog.user.screen_name,
          text: item.mblog.text,
          source: item.mblog.source,
          postCreatedAt: item.mblog.created_at,
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

function getDataByDate(targetLink, minDate) {
  let page = 1;
  let status = true;
  let promise = Promise.resolve();
  let tryRequest = function (page) {
    return promise.then(() => {
      return requestAndParseData(targetLink, page).then(posts => {
        return Promise.all(posts.map(post => {
          return saveOrUpdataToDb(post);
        })).then(() => {
          let lastPost = posts.pop();
          if (new Date('2017-' + lastPost.createdAt) > minDate) {
            return tryRequest(++page)
          }
        }).catch(e => {
          console.log(e);
        })
      })
    })
  };
  return tryRequest(page);
}

let link = 'https://m.weibo.cn/u/1400854834?uid=1400854834&luicode=20000061&lfid=4121408394999132&featurecode=20000180';

// tranLink(link).then(targetLink => {
//   return requestAndParseData(targetLink, 1);
// }).then(posts => {
//   return Promise.all(posts.map(post => {
//     return saveOrUpdataToDb(post);
//   }));
// }).then(() => {
//   console.log('done');
// })


// 需完善日期判断
tranLink(link).then(targetLink => {
  return getDataByDate(targetLink, new Date('2017-09-01'))
}).then(() => {
  console.log('done');
})