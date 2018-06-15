'use strict';

const mongoose = require('mongoose');

const WeiboCnProfile = new mongoose.Schema({
  // 名称
  nickName: String,
  // 链接
  uri: String,
  // 微博数
  weiboCount: Number,
  // 关注数
  followCount: Number,
  // 粉丝数
  followersCount: Number,
  // 属性
  property: String,
  // 分类
  category: String
}, { timestamps: true });

WeiboCnProfile.index({ uri: 1 });

mongoose.model('WeiboCnProfile', WeiboCnProfile);
