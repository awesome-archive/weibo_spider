'use strict';

const WeiboCnPost = require('./models/WeiboCnPost');
const WeiboCnProfile = require('./models/WeiboCnProfile');
const config = {
  minTime: new Date(2017, 0, 1),
  maxTime: new Date(2017, 11, 1)
};
const fs = require('fs');
const json2csv = require('json2csv');
const moment = require('moment');
const schools = require('./schools');
const sInfo = [], sName = [], wName = [];
schools.forEach(s => {
  sInfo.push(s[0]);
  sName.push(s[1]);
  wName.push(s[3]);
});

function exportToJson() {
  return WeiboCnPost.find({
    postCreatedAt: { $gte: config.minTime, $lte: config.maxTime }
  }).sort({ profile: 1, postCreatedAt: 1 }).populate('profile').then(posts => {
    let json = JSON.stringify(posts, null, 4);
    fs.writeFileSync('./export.json', json);
  });
}

function exportToCsv() {
  return WeiboCnPost.find({
    postCreatedAt: { $gte: config.minTime, $lte: config.maxTime }
  }).sort({ profile: 1, postCreatedAt: 1 }).populate('profile').then(posts => {
    let data = posts.map(post => {
      return {
        profileTitle: post.profile.nickName,
        profileUri: post.profile.uri,
        publishAt: moment(post.postCreatedAt).format('YYYY-MM-DD HH:mm'),
        repostsCount: post.repostsCount,
        commentsCount: post.commentsCount,
        attitudesCount: post.attitudesCount,
        content: post.content,
        link: post.sourceLink,
        postFrom: post.postFrom,
        weiboCount: post.profile.weiboCount,
        followCount: post.profile.followCount,
        followersCount: post.profile.followersCount
      };
    });
    let fields = ['profileTitle', 'publishAt', 'repostsCount', 'commentsCount', 'attitudesCount', 'content', 'link', 'postFrom', 'weiboCount', 'followCount', 'followersCount', 'profileUri'];
    let fieldNames = ['微博名称', '发布时间', '转发数', '评论数', '点赞数', '内容', '链接', '来自', '微博数', '关注数', '粉丝数', '微博链接'];
    let csv = json2csv({ data: data, fields: fields, fieldNames: fieldNames });
    fs.writeFileSync('./weibo-basic.csv', csv);
    // 聚合统计
    // 季度发文数、发文总点赞量、平均点赞量、微博粉丝量
    let aggrObj = {};
    let aggrArray = [];
    data.forEach(item => {
      let key = item.profileTitle;
      if (key in aggrObj) {
        aggrObj[key].count += 1;
        aggrObj[key].like += item.attitudesCount;
      } else {
        aggrObj[key] = {
          count: 1,
          like: item.attitudesCount,
          followersCount: item.followersCount
        };
      }
    });
    Object.keys(aggrObj).forEach(key => {
      let item = aggrObj[key];
      if (/广东机电职业技术学院/.test(key)) key = '广东机电职业技术学院';
      let i = wName.indexOf(key);
      if (i == -1) {
        throw Error(key);
      }
      let schoolInfo = sInfo[i];
      let schoolName = sName[i];
      aggrArray.push({
        schoolInfo: schoolInfo,
        schoolName: schoolName,
        profileTitle: key,
        count: item.count,
        sumLike: item.like,
        aveLike: Math.round(item.like / item.count),
        followersCount: item.followersCount
      });
    });
    let aggrFields = ['schoolInfo', 'schoolName', 'profileTitle', 'count', 'sumLike', 'aveLike', 'followersCount'];
    let aggrFieldNames = ['属性', '学校名称', '微博名称', '发文总数', '总点赞量', '平均点赞量', '微博粉丝量'];
    let aggrCsv = json2csv({ data: aggrArray, fields: aggrFields, fieldNames: aggrFieldNames });
    fs.writeFileSync('./weibo-aggr.csv', aggrCsv);
  });
}

exportToCsv().then(() => {
  console.log('done');
});