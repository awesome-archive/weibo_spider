'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const moment = require('moment');
const rp = require('request-promise');
const models = require('./models');
const config = require('./config');

const { WeiboCnPost, WeiboCnProfile } = models;

const { sleepInterval, spiderTimeInterval } = config;
const { base: sleepBase, random: sleepRandom } = sleepInterval;
const randomMs = function() {
  return Math.round(Math.random() * sleepRandom + sleepBase);
};

class CrawlHistory {
  constructor() {
    this.count = 0;
    this.file = path.join(__dirname, './crawl.log');
    this.countInterval = 50;
    this.timeInterval = spiderTimeInterval;

    this.clean();
  }
  shouldCrawl(uri) {
    try {
      const res = fs.readFileSync(this.file, 'utf8').trim().split('\n');
      const uris = res.map(line => line.split(', ')[1]);
      if (~uris.indexOf(uri)) return false;
      return true;
    } catch(e) {
      return true;
    }
  }
  set(uri) {
    fs.appendFileSync(this.file, `${Date.now()}, ${uri}\n`, 'utf8');
    this.count++;
    if (this.count % this.countInterval === 0) {
      this.clean();
    }
  }
  clean() {
    try {
      let res = fs.readFileSync(this.file, 'utf8').trim().split('\n');
      res = res.filter(line => {
        const time = line.split(', ')[0];
        const interval = Date.now() - time;
        if (interval > this.timeInterval) return false;
        return true;
      });
      fs.writeFileSync(this.file, res.join('\n') + '\n', 'utf8');
    } catch (e) {
      // do nothing
    }
  }
}

const crawlHistory = new CrawlHistory();

module.exports = getWeiboCn;

async function getWeiboCn(uri, minDate) {
  minDate = minDate || new Date();
  const profile = await getProfile(uri);

  const getWeiboByDate = async function(page) {
    const res = await getWeibo(profile, page);
    if (res.postCreatedAt > minDate) {
      await getWeiboByDate(res.nextPage);
    }
  };

  await getWeiboByDate();
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

async function getWeibo(profile, page = 1) {
  let uri = profile.uri;
  uri = uri + '?page=' + page;

  // 判断是否最近抓取过，如抓取过，直接抓下一个页面
  if (!crawlHistory.shouldCrawl(uri)) {
    console.log(`${uri} already crawled, jump to next page\n`);
    return {
      postCreatedAt: new Date(),
      nextPage: page + 1
    };
  }

  const options = {
    uri: uri,
    headers: { Cookie: config.cookie }
  };

  const html = await getHtml(options);
  const postRegex = /(<div\sclass="c"\sid="M_.+?)<div\sclass="s"><\/div>/g;
  const weiboArray = [];

  html.replace(postRegex, (match, post) => {
    try {
      const $ = cheerio.load(post);
      const text = $.text();
      const data = /^(.+?)赞\[(\d+)\]\s转发\[(\d+)\]\s评论\[(\d+)\]\s收藏\s(.+?)\s来自(.+?)$/.exec(text);
      let sourceLink = '';
      post.replace(/href="(https:\/\/weibo.cn\/comment.+?)"/g, (match, link) => {
        sourceLink = link;
      });
      if (data && data.length) {
        const weibo = {
          profile: profile._id,
          content: data[1].trim(),
          sourceLink: sourceLink,
          attitudesCount: parseInt(data[2]),
          repostsCount: parseInt(data[3]),
          commentsCount: parseInt(data[4]),
          postCreatedAt: getPublishTime(data[5]),
          postFrom: data[6]
        };

        console.log(moment(weibo.postCreatedAt).format('YYYY-MM-DD HH:mm'));
        console.log(weibo.content.slice(0, 50) + '...');
        console.log();

        weiboArray.push(weibo);
      }
    } catch (e) {
      throw e;
    }
  });

  if (!weiboArray.length) {
    throw new Error(`weiboArray无item\n${uri}\n`);
  }

  await Promise.all(weiboArray.map(weibo => {
    return WeiboCnPost.findOneAndUpdate(
      { sourceLink: weibo.sourceLink },
      weibo,
      { upsert: true, new: true }
    );
  }));

  await new Promise(resolve => {
    setTimeout(resolve, randomMs());
  });

  crawlHistory.set(uri);

  return {
    postCreatedAt: weiboArray[weiboArray.length - 1].postCreatedAt,
    nextPage: page + 1
  };
}

async function getProfile(uri) {
  const options = {
    uri: uri,
    headers: { Cookie: config.cookie }
  };
  const html = await getHtml(options);

  const match = html.match(/<span\sclass="tc">微博\[(\d+)\].+?关注\[(\d+)\].+?粉丝\[(\d+)\]/);
  if (match) {
    const nickNameMatch = html.match(/<span\sclass="ctt">(.+?)</);
    let nickName = '';
    if (nickNameMatch) nickName = nickNameMatch[1];
    const profile = await WeiboCnProfile.findOneAndUpdate(
      { uri },
      {
        nickName,
        uri,
        weiboCount: match[1],
        followCount: match[2],
        followersCount: match[3],
      },
      { upsert: true, new: true }
    );
    console.log('抓取微博账号:', profile.nickName, '\n');
    return profile;
  } else {
    throw new Error('解析profile错误');
  }
}


async function getHtml(options) {
  try {
    const html = await Promise.race([
      new Promise(resolve => {
        setTimeout(resolve, 5000);
      }),
      rp(options)
    ]);
    if (html) return html;
    return await getHtml(options);
  } catch(e) {
    throw e;
  }
}
