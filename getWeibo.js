var https = require('https');
var mysql = require('mysql');
var util = require('util');
var url = require('url');
var fs = require('fs');


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '0000',
	database: 'weibo'
});

connection.connect();

var dateTime = Date.now();

function setDateTime(t){
	dateTime = t;
}

// 给定手机端网页微博主页链接
function tranLink(l, cb){
	var o = url.parse(l);
	if (o.hostname == 'm.weibo.cn') {
		if (/\/p\/\d{16}/.test(o.pathname)) {
			var cid = /\/p\/(\d{16})/.exec(o.pathname)[1].replace('100505', '107603');
			var link = 'https://m.weibo.cn/api/container/getIndex?containerid=' + cid + '&page=';
			// console.log(link);
			getLinksToDb(link, 1, cb);
		} else if (/\/u\/\d{10}/.test(o.pathname)) {
			var cid = /\/u\/(\d{10})/.exec(o.pathname)[1];
			cid = '107603' + cid;
			var link = 'https://m.weibo.cn/api/container/getIndex?containerid=' + cid + '&page=';
			// console.log(link);
			getLinksToDb(link, 1, cb);
		} else {
			console.log('错误的链接');
		}
	} else {
		console.log('错误的链接');
	}
}


// ajax传输特定的链接
function getLinksToDb(link, count, callback){
	getJson(link, count, function(link, count, body){
		parseJson(link, count, body, function(o){
			saveJsonToDb(o);
		}, callback);
	});
}

function getJson(link, count, cb){
	var nowLink = link + count;
	https.get(nowLink ,function(res){
		var body = [];
		res.on('data', function(data){
			body.push(data);
		});
		res.on('end', function(){
			body = Buffer.concat(body).toString();
			cb(link, count, body);
		});
	}).on('error', function(error){
		throw error;
	});
}

function parseJson(link, count, content, cb, callback){

	try {
		JSON.parse(content);
	} catch(e) {
		fs.writeFileSync('1.json', content);
		throw (e);
	}

	content = JSON.parse(content);
	content = content.cards;
	var itemsArray = [];
	for (var i=0, len=content.length; i<len; i++){
		var item = content[i];
		var cardType = item.card_type;
		if (cardType == '9') {
			var createdAt = item.mblog.created_at;
			if (createdAt.indexOf('今天') > -1) {
				var toDoubleDigit = function(s){
					s = s.toString();
					if (s.length == 1) {
						return '0' + s;
					} else {
						return s;
					}
				};
				var month = toDoubleDigit(new Date().getMonth() + 1);
				var date = toDoubleDigit(new Date().getDate());
				createdAt = createdAt.replace('今天', month + '-' + date);
			}
			if (createdAt.indexOf('分钟前') > -1) {
				createdAt = formatTime(Date.now() - parseInt(createdAt.replace('分钟前', '')) * 60 * 1000);
			}
			if (createdAt.length == 11) {
				createdAt = '2017-' + createdAt;
			}
			var itemObj = {
				itemId: item.itemid,
				scheme: item.scheme,
				screenName: item.mblog.user.screen_name,
				text: item.mblog.text.replace(/[\ud000-\udfff]/g, ''),
				source: item.mblog.source,
				createdAt: createdAt,
				repostsCount: item.mblog.reposts_count,
				commentsCount: item.mblog.comments_count,
				attitudesCount: item.mblog.attitudes_count,
				followersCount: item.mblog.user.followers_count,
				followCount: item.mblog.user.follow_count
			};
			cb(itemObj);
		}
	}

	try {
		new Date(itemObj.createdAt);
	} catch(e) {
		console.log(itemObj);
		throw (e);
	}

	if (new Date(itemObj.createdAt) > new Date(dateTime)) {
		getLinksToDb(link, ++count, callback);
	} else {
		callback();
	}
}

function saveJsonToDb(o){
	connection.query('select id from msg where itemId = ?', [o.itemId], function(err, results){
		if (err) throw err;
		if (results.length == 0) {
			connection.query('insert into msg set ?', o, function(err, results){
				if (err) throw err;
				console.log(results.insertId, o.screenName, o.createdAt);
			});
		} else {
			connection.query('update msg set itemId = ?, scheme = ?, screenName = ?, text = ?, source = ?, createdAt = ?, repostsCount = ?, commentsCount = ?, attitudesCount = ?, followersCount = ?, followCount = ? where id = ?', [o.itemId, o.scheme, o.screenName, o.text, o.source, o.createdAt, o.repostsCount, o.commentsCount, o.attitudesCount, o.followersCount, o.followCount, results[0].id], function(err, results){
				if (err) throw err;
				console.log(o.screenName + ' - ' + o.itemId);
			});
		}
	});	
}


function formatTime(timeString){
	var toDoubleDigit = function(number){
		number = number.toString();
		number.length == 1 && (number = '0' + number);
		return number;
	};
	var time = new Date(timeString);
	var year = time.getFullYear();
	var month = toDoubleDigit(time.getMonth() + 1);
	var date = toDoubleDigit(time.getDate());
	var hour = toDoubleDigit(time.getHours());
	var minute = toDoubleDigit(time.getMinutes());
	return util.format('%s-%s-%s %s:%s', year, month, date, hour, minute);
}



exports.getLinksToDb = getLinksToDb;
exports.tranLink = tranLink;
exports.setDateTime = setDateTime;
