'use strict';

const mongoose = require('mongoose');

const WeiboCnPost = new mongoose.Schema({
  // 账号
  profile: { type: 'ObjectId', ref: 'WeiboCnProfile' },
  // 内容
  content: String,
  // 原始链接
  sourceLink: String,
  // 发布时间
  postCreatedAt: Date,
  // 来自
  postFrom: String,
  // 转发
  repostsCount: Number,
  // 评论
  commentsCount: Number,
  // 赞
  attitudesCount: Number
}, { timestamps: true });

WeiboCnPost.index({ sourceLink: 1 });

mongoose.model('WeiboCnPost', WeiboCnPost);
