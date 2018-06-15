'use strict';

const child_process = require('child_process');

// deamon
function spawn(mainModule) {
  const worker = child_process.spawn('node', [mainModule], { stdio: 'inherit' });

  worker.on('exit', function(code) {
    if (code !== 0) {
      console.log('出现错误，5s后重启程序\n');
      setTimeout(() => {
        spawn(mainModule);
      }, 5000);
    }
  });
}

spawn('index.js');
