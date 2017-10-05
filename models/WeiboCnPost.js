'use strict';

require('./connect');
const mongoose = require('mongoose');

const WeiboCnPost = new mongoose.Schema({
  profile: { type: 'ObjectId', ref: 'WeiboCnProfile' },
  content: String,
  sourceLink: String,
  postCreatedAt: Date,
  postFrom: String,
  // 转发
  repostsCount: Number,
  // 评论
  commentsCount: Number,
  // 赞
  attitudesCount: Number
});

WeiboCnPost.plugin(require('mongoose-timestamp'));

module.exports = mongoose.model('WeiboCnPost', WeiboCnPost);