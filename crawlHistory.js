'use strict';

const fs = require('fs');
const path = require('path');

const { spiderTimeInterval } = require('./config');

class CrawlHistory {
  constructor() {
    this.count = 0;
    this.file = path.join(__dirname, './crawl.log');
    this.countInterval = 50;
    this.timeInterval = spiderTimeInterval;

    this.clean();
  }
  shouldCrawl(uri) {
    try {
      const res = fs.readFileSync(this.file, 'utf8').trim().split('\n');
      const uris = res.map(line => line.split(', ')[1]);
      if (~uris.indexOf(uri)) return false;
      return true;
    } catch (e) {
      return true;
    }
  }
  set(uri) {
    fs.appendFileSync(this.file, `${Date.now()}, ${uri}\n`, 'utf8');
    this.count++;
    if (this.count % this.countInterval === 0) {
      this.clean();
    }
  }
  clean() {
    try {
      let res = fs.readFileSync(this.file, 'utf8').trim().split('\n');
      res = res.filter(line => {
        const time = line.split(', ')[0];
        const interval = Date.now() - time;
        if (interval > this.timeInterval) return false;
        return true;
      });
      fs.writeFileSync(this.file, res.join('\n') + '\n', 'utf8');
    } catch (e) {
      // do nothing
    }
  }
}

const crawlHistory = new CrawlHistory();

module.exports = crawlHistory;
