'use strict';

const mongoose = require('mongoose');

const WeiboCnProfile = new mongoose.Schema({
  nickName: String,
  uri: String,
  weiboCount: Number,
  followCount: Number,
  followersCount: Number,
  property: String,
  category: String
});

WeiboCnProfile.plugin(require('mongoose-timestamp'));

mongoose.model('WeiboCnProfile', WeiboCnProfile);
