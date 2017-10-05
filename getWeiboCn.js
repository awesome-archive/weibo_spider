'use strict';

const rp = require('request-promise');
const cheerio = require('cheerio');
const WeiboCnPost = require('./models/WeiboCnPost');
const WeiboCnProfile = require('./models/WeiboCnProfile');
const fs = require('fs');

const config = {
  cookie: '_T_WM=978724ef7105eb38cf3ac270d74eedaa; SUB=_2A2500ZuDDeRhGeVL6FQX8SjPwz-IHXVUPSXLrDV6PUJbkdBeLVnDkW2cS-h--pnnpv4G38RMRbzeE68TWw..; SUHB=0u5Rdd2NLdftNW; SCF=AsjGpHiRCF78UtqAf93bAzk6B0-SIE9maWQeYfNOoK9yfZNQWFzrxR1b6HevXSgFgRFR63M8qmjwQO8gWzkqz5o.; SSOLoginState=1507191763'
};

exports = module.exports = main;
exports.getWeibo = getWeibo;

function main(uri, minDate) {
  minDate = minDate || new Date();
  return getProfile(uri).then(profile => {
    let getWeiboByDate = function(page) {
      // sleep
      let promise = Promise.resolve();
      promise = promise.then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });
      });
      return promise.then(() => {
        return getWeibo(profile, page).then(result => {
          if (result.postCreatedAt > minDate) {
            return getWeiboByDate(result.nextPage);
          }
        });
      });
    };
    return getWeiboByDate();
  });
}

function getPublishTime(string) {
  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  let date = new Date().getDate();
  string = string.trim();
  if (string.indexOf('分钟前') > -1) {
    let m = /(\d+)分钟前/.exec(string)[1];
    m = parseInt(m);
    return new Date(Date.now() - m*60*1000);
  } else if (string.indexOf('今天') > -1) {
    let data = /今天\s(\d+):(\d+)/.exec(string);
    let h = parseInt(data[1]);
    let m = parseInt(data[2]);
    return new Date(year, month, date, h, m);
  } else if (/\d+月\d+日/.test(string)) {
    let data = /(\d+)月(\d+)日\s(\d+):(\d+)/.exec(string);
    month = parseInt(data[1]) - 1;
    date = parseInt(data[2]);
    let h = parseInt(data[3]);
    let m = parseInt(data[4]);
    return new Date(year, month, date, h, m);
  } else {
    return new Date(string);
  }
}

function getWeibo(profile, page) {
  let uri = profile.uri;
  if (page) {
    uri = uri + '?page=' + page;
    let alreadyCrawlUris = fs.readFileSync('./crawlHistory.txt', 'utf8').trim().split('\n');
    if (alreadyCrawlUris.indexOf(uri) > -1) {
      console.log(`${uri} already crawled, jump to next page`);
      return Promise.resolve({
        postCreatedAt: new Date(),
        nextPage: page + 1
      });
    }
    fs.appendFileSync('./crawlHistory.txt', `${uri}\n`);
  } else {
    page = 1;
  }
  let options = {
    uri: uri,
    headers: {
      Cookie: config.cookie
    }
  };
  return rp(options).then(html => {
    let postRegex = /(<div\sclass="c"\sid="M_.+?)<div\sclass="s"><\/div>/g;
    let weiboArray = [];
    html.replace(postRegex, (match, post) => {
      try {
        let $ = cheerio.load(post);
        let text = $.text();
        let data = /^(.+?)赞\[(\d+)\]\s转发\[(\d+)\]\s评论\[(\d+)\]\s收藏\s(.+?)\s来自(.+?)$/.exec(text);
        let sourceLink = '';
        post.replace(/href="(https:\/\/weibo.cn\/comment.+?)"/g, (match, link) => {
          sourceLink = link
        });
        let weibo = {
          profile: profile._id,
          content: data[1].trim(),
          sourceLink: sourceLink,
          attitudesCount: parseInt(data[2]),
          repostsCount: parseInt(data[3]),
          commentsCount: parseInt(data[4]),
          postCreatedAt: getPublishTime(data[5]),
          postFrom: data[6]
        };
        weiboArray.push(weibo);
      } catch (e) {
        console.log(e);
      }
    });
    return Promise.all(weiboArray.map(weibo => {
      return WeiboCnPost.findOne({
        sourceLink: weibo.sourceLink
      }).then(post => {
        if (post) {
          return WeiboCnPost.findByIdAndUpdate(post._id, weibo, { new: true });
        } else {
          let post = new WeiboCnPost(weibo);
          return post.save();
        }
      })
    })).then(() => {
      return {
        postCreatedAt: weiboArray[weiboArray.length - 1].postCreatedAt,
        nextPage: page + 1
      };
    });
  })
}

function getProfile(uri) {
  let options = {
    uri: uri,
    headers: {
      Cookie: config.cookie
    }
  };
  return rp(options).then(html => {
    let data = /<span\sclass="tc">微博\[(\d+)\].+?关注\[(\d+)\].+?粉丝\[(\d+)\]/.exec(html);
    let profile = {
      nickName: /<span\sclass="ctt">(.+?)</.exec(html)[1],
      uri: uri,
      weiboCount: data[1],
      followCount: data[2],
      followersCount: data[3]
    };
    return WeiboCnProfile.findOne({
      uri: profile.uri
    }).then(p => {
      if (p) {
        return WeiboCnProfile.findByIdAndUpdate(p._id, profile, { new: true });
      } else {
        let p = new WeiboCnProfile(profile);
        return p.save();
      }
    })
  })
}