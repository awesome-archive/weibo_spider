'use strict';

const mongoose = require('mongoose');

mongoose.set('debug', true);

mongoose.connect('mongodb://127.0.0.1/spider', {
  useMongoClient: true
});

mongoose.Promise = global.Promise;