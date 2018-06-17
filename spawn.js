'use strict';

const child_process = require('child_process');
const { rebootInterval = 5000 } = require('./config');

// deamon
function spawn(mainModule) {
  const worker = child_process.spawn('node', [mainModule], { stdio: 'inherit' });

  worker.on('exit', function(code) {
    if (code !== 0) {
      console.log(`出现错误，${rebootInterval / 1000}s后重启程序\n`);
      setTimeout(() => {
        spawn(mainModule);
      }, rebootInterval);
    }
  });
}

spawn('index.js');
