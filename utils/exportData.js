'use strict';

const models =require('../models');
const moment = require('moment');
const json2csv = require('json2csv');
const fs = require('fs');
const path = require('path');

const postFieldsMap = {
  repostsCount: '转发数',
  commentsCount: '评论数',
  attitudesCount: '点赞数',
  content: '内容',
  sourceLink: '地址',
  postCreatedAt: '发布时间',
  postFrom: '来自',
};

const profileFieldsMap = {
  nickName: '微博名称',
  category: '分类',
  property: '属性',
  uri: '微博链接',
  weiboCount: '微博数',
  followCount: '关注数',
  followersCount: '粉丝数'
};

module.exports = class ExportData {

  constructor(category, minDate, maxDate, path, basename) {
    if (!category || !Array.isArray(category)) throw new Error('请传入正确category参数');
    if (!minDate || !maxDate) throw new Error('请传入时间范围');
    this.category = category;
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.path = path;
    this.basename = basename;
  }

  async toFile() {
    this.saveFile(
      path.join(this.path, `${this.basename}微博.json`),
      await this.toJson()
    );
    this.saveFile(
      path.join(this.path, `${this.basename}微博.csv`),
      await this.toCsv()
    );
    this.saveFile(
      path.join(this.path, `${this.basename}微博统计.json`),
      await this.toStaJson()
    );
    this.saveFile(
      path.join(this.path, `${this.basename}微博统计.csv`),
      await this.toStaCsv()
    );
  }

  saveFile(pathname, data) {
    fs.writeFileSync(pathname, data, 'utf8');
    console.log('已保存文件:', pathname);
  }

  async toJson() {
    const data = await this.findData();
    return JSON.stringify(data, null, 4);
  }

  async toCsv() {
    const data = await this.findData();
    return addBom(json2csv({ data }));
  }

  async toStaJson() {
    const data = await this.statistic();
    return JSON.stringify(data, null, 4);
  }

  async toStaCsv() {
    const data = await this.statistic();
    return addBom(json2csv({ data }));
  }

  async findData() {
    const profiles = await models.WeiboCnProfile.find({ category: { $in: this.category } });
    const profileIds = profiles.map(p => p._id);
    const posts = await models.WeiboCnPost.find({
      profile: { $in: profileIds },
      postCreatedAt: { $gte: this.minDate, $lt: this.maxDate }
    }).populate('profile').sort('profile postCreatedAt');

    return posts.map(post => {
      const { profile = {} } = post;
      const obj = {};
      Object.keys(profileFieldsMap).forEach(key => {
        if (profile[key]) obj[profileFieldsMap[key]] = profile[key];
      });
      Object.keys(postFieldsMap).forEach(key => {
        let value = post[key];
        if (value) {
          if (key === 'postCreatedAt' && Object.prototype.toString.call(value) === '[object Date]') {
            value = moment(value).format('YYYY-MM-DD HH:mm');
          }
          obj[postFieldsMap[key]] = value;
        }
      });
      if (!obj.转发数) obj.转发数 = 0;
      if (!obj.评论数) obj.评论数 = 0;
      if (!obj.点赞数) obj.点赞数 = 0;
      return obj;
    });
  }

  async statistic() {
    const data = await this.findData();
    const aggrObj = {};
    data.forEach(item => {
      const { 微博名称, 分类, 属性, 微博链接, 微博数, 关注数, 粉丝数, 转发数 = 0, 评论数 = 0, 点赞数 = 0 } = item;
      const key = 微博链接;
      if (key in aggrObj) {
        aggrObj[key].总点赞数 += 点赞数;
        aggrObj[key].总转发数 += 转发数;
        aggrObj[key].总评论数 += 评论数;
        aggrObj[key].总发文数 += 1;
      } else {
        aggrObj[key] = {
          微博名称,
          分类,
          属性,
          微博链接,
          微博数,
          关注数,
          粉丝数,
          总点赞数: 点赞数,
          总转发数: 转发数,
          总评论数: 评论数,
          总发文数: 1
        };
      }
    });

    // 那些本季度没有发过微博的账号也需要查找出来
    const profiles = await models.WeiboCnProfile.find({ category: { $in: this.category } });
    profiles.forEach(p => {
      const { uri } = p;
      if (!aggrObj[uri]) {
        aggrObj[uri] = {};
        Object.keys(profileFieldsMap).forEach(key => {
          aggrObj[uri][profileFieldsMap[key]] = p[key];
        });
      }
    });

    const aggrArray = Object.keys(aggrObj).map(key => aggrObj[key]);
    return aggrArray;
  }

};

function addBom(csv) {
  const bom = Buffer.from('\uFEFF');
  const csvBuf = Buffer.from(csv);
  return Buffer.concat([bom, csvBuf]).toString();
}
