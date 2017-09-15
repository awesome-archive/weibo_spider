var getWeibo = require('./getWeibo');

var link = 'https://m.weibo.cn/u/1400854834?uid=1400854834&luicode=20000061&lfid=4121408394999132&featurecode=20000180';
var cb = function(){
	console.log('ok');
};
getWeibo.setDateTime(new Date(2017, 5, 1).getTime());
getWeibo.tranLink(link, cb);