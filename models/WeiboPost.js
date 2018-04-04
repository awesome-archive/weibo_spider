'use strict';

const mongoose = require('mongoose');

const WeiboPost = new mongoose.Schema({
  itemId: String,
  scheme: String,
  screenName: String,
  text: String,
  source: String,
  postCreatedAt: Date,
  repostsCount: Number,
  commentsCount: Number,
  attitudesCount: Number,
  followersCount: Number,
  followCount: Number,
});

WeiboPost.plugin(require('mongoose-timestamp'));

mongoose.model('WeiboPost', WeiboPost);
