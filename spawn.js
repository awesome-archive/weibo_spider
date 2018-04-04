'use strict';

const child_process = require('child_process');

// deamon
function spawn(mainModule) {
  const worker = child_process.spawn('node', [mainModule], { stdio: 'inherit' });

  worker.on('exit', function(code) {
    if (code !== 0) {
      console.log('重启程序');
      console.log();
      spawn(mainModule);
    }
  });
}

spawn('index.js');
