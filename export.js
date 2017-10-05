'use strict';

const WeiboCnPost = require('./models/WeiboCnPost');
const WeiboCnProfile = require('./models/WeiboCnProfile');
const config = {
  minTime: new Date(2017, 6, 1),
  maxTime: new Date(2017, 9, 1)
};
const fs = require('fs');
const json2csv = require('json2csv');
const moment = require('moment');

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
    fs.writeFileSync('./export.csv', csv);
  });
}

exportToCsv().then(() => {
  console.log('done');
});