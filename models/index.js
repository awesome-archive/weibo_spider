'use strict';

const mongoose = require('mongoose');
const path = require('path');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/spider');

mongoose.set('debug', false);

// Load All Models
[
  'WeiboCnPost',
  'WeiboCnProfile',
].forEach(function (modelName) {
  require(path.join(__dirname, modelName));
  exports[modelName] = mongoose.model(modelName);
});
