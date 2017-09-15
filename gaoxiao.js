var getWeibo = require('./getWeibo');
var mysql = require('mysql');

var links = [];

getWeibo.setDateTime(new Date(2017, 5, 25).getTime());

var cb = function(){
	console.log('ok');
};


// 中山大学
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=1892723783&containerid=1076031892723783&page=');
// 华南理工大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076035549605449&page=');
// 暨南大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031874566305&page=');
// 华南师范大学
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=5338220864&containerid=1076035338220864&page=');
// 汕头大学新闻中心
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032413579830&page=');
// 广东外语外贸大学
links.push('https://m.weibo.cn/api/container/getIndex?uid=5634638416&luicode=10000011&lfid=100103type%3D17%26q%3D%E5%B9%BF%E4%B8%9C%E5%A4%96%E8%AF%AD%E5%A4%96%E8%B4%B8%E5%A4%A7%E5%AD%A6&featurecode=20000180&type=all&containerid=1076035634638416&page=');
// 南方医科大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031877897325&page=');
// 广州医科大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032644825532&page=');
// 华南农业大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076033271376974&page=');
// 广东工业大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032842266491&page=');
// 广州大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032485519497&page=');
// 广州中医药大学学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031856719844&page=');
// 广州美术学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031880648072&page=');
// 南方科技大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076036094267763&page=');
// 广东医科大学
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=3274792502&containerid=1076033274792502&page=');
// 广东海洋大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032730967682&page=');
// 佛山科学技术学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031860461142&page=');
// 东莞理工学院学生会 
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031808522524&page=');
// 深圳大学招生办
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031823024253&page=');
// 联合国际学院_UIC
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076033206359200&page=');
// 香港中文大学深圳
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=5107569889&containerid=1076035107569889&page=');
// 广州民航职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032564511917&page=');
// 广东轻工职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076036077521132&page=');
// 广东机电职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031889759232&page=');
// 广东工贸职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032764495290&page=');
// 广东科学技术职业学院
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=3202758107&containerid=1076033202758107&page=');
// 广东交通职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076035271456021&page=');
// 广东水利电力职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031891976961&page=');
// 广东食品药品职业学院学生联合会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032059060112&page=');
// 广东农工商职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032683930533&page=');
// 广州番禺职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032481981297&page=');
// 广州铁路职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032486064927&page=');
// 深圳职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032941494314&page=');
// 深圳信息学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031985598714&page=');
// 中山职业技术学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032019725430&page=');
// 佛山职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=3201571121&containerid=1076033201571121&page=');
// 顺德职业技术学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031680431970&page=');
// 东莞职业技术学院学生
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031853303645&page=');
// 广东财经大学
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076033745797611&page=');
// 广东金融学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031883986235&page=');
// 广东技术师范学院校园
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=5344693377&containerid=1076035344693377&page=');
// 广东药学院教务处
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032128707531&page=');
// 五邑大学学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031763466304&page=');
// 韶关学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032806873433&page=');
// 肇庆学院
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=3757859370&containerid=1076033757859370&page=');
// 韩山师范学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031883641237&page=');
// 仲恺农业工程学院团委
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=3624901297&containerid=1076033624901297&page=');
// 惠州学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=1884358003&containerid=1076031884358003&page=');
// 嘉应学院学生会官方
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031827409353&page=');
// 广东石油化工学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076035571198660&page=');
// 广东第二师范学院团委
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032409931227&page=');
// 岭南师范学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032672404563&page=');
// 广州航海学院校团委
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032810680240&page=');
// 广东警官学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=1891153170&containerid=1076031891153170&page=');
// 广州体育学院学生社团联合会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032057247240&page=');
// 广东理工学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031896694161&page=');
// 广州工商共青团
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031908326534&page=');
// 广东培正学院招生办
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031842108270&page=');
// 广东白云学院学生处
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031422670331&page=');
// 广东东软学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076035431892558&page=');
// 吉林大学珠海学院
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=3783131080&containerid=1076033783131080&page=');
// 北京师范大学珠海分校
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076035086862797&page=');
// 北京理工大学珠海学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031873624837&page=');
// 中大南方学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031849095841&page=');
// 中山大学新华学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032189508934&page=');
// 华南理工大学广州学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076033071769917&page=');
// 东外语外贸大学南国商学院团委
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=1808541582&containerid=1076031808541582&page=');
// 中山学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031845884522&page=');
// 广东技术师范学院天河学院
links.push('https://m.weibo.cn/api/container/getIndex?jumpfrom=weibocom&type=uid&value=2180632467&containerid=1076032180632467&page=');
// 华商学院团委新媒体
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032635803683&page=');
// 广州大学华软软件学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031748849383&page=');
// 广东工业大学华立学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031827697584&page=');
// 华农大珠江学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031808440460&page=');
// 广州大学松田学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031901498782&page=');
// 广东海洋大学寸金学院学生会
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031795138653&page=');
// 东莞理工学院城市学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076031904241815&page=');
// 广州商学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076033381027042&page=');
// 广东科技学院
links.push('https://m.weibo.cn/api/container/getIndex?containerid=1076032128706671&page=');




var len = links.length;
(function getWeiboRange(i, len, cb){
	if (i<len) {
		getWeibo.getLinksToDb(links[i], 1, function(){
			getWeiboRange(++i, len, cb);
		});
	} else {
		cb();
	}
})(0, len, function(){
	console.log('success');
});















