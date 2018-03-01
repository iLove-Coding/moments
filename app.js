// TODO: 用户名称需修改为自己的名称
var userName = 'Lu仔酱';
// 朋友圈页面的数据
var data = [{
	user: {
		name: '阳和',
		avatar: './img/avatar2.png'
	},
	content: {
		type: 0, // 多图片消息
		text: '华仔真棒，新的一年继续努力！',
		pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
		share: {},
		timeString: '3分钟前'
	},
	reply: {
		hasLiked: false,
		likes: ['Guo封面', '源小神'],
		comments: [{
			author: 'Guo封面',
			text: '你也喜欢华仔哈！！！'
		}, {
			author: '喵仔zsy',
			text: '华仔实至名归哈'
		}]
	}
}, {
	user: {
		name: '伟科大人',
		avatar: './img/avatar3.png'
	},
	content: {
		type: 1, // 分享消息
		text: '全面读书日',
		pics: [],
		share: {
			pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
			text: '飘洋过海来看你'
		},
		timeString: '50分钟前'
	},
	reply: {
		hasLiked: false,
		likes: ['阳和'],
		comments: []
	}
}, {
	user: {
		name: '深圳周润发',
		avatar: './img/avatar4.png'
	},
	content: {
		type: 2, // 单图片消息
		text: '很好的色彩',
		pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
		share: {},
		timeString: '一小时前'
	},
	reply: {
		hasLiked: false,
		likes: [],
		comments: [{
				author: 'Guo封面',
				text: '你也喜欢华仔哈！！！'
			},
			{
				author: 'Guo封面',
				text: '你也喜欢华仔哈！！！'
			}
		]
	}
}, {
	user: {
		name: '喵仔zsy',
		avatar: './img/avatar5.png'
	},
	content: {
		type: 3, // 无图片消息
		text: '以后咖啡豆不敢浪费了',
		pics: [],
		share: {},
		timeString: '2个小时前'
	},
	reply: {
		hasLiked: false,
		likes: [],
		comments: []
	}
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
	if(!likes.length) {
		return '';
	}
	var htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
	// 点赞人的html列表
	var likesHtmlArr = [];
	// 遍历生成
	for(var i = 0, len = likes.length; i < len; i++) {
		likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
	}
	// 每个点赞人以逗号加一个空格来相隔
	var likesHtmlText = likesHtmlArr.join(', ');
	htmlText.push(likesHtmlText);
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
	if(!comments.length) {
		return '';
	}
	var htmlText = ['<div class="reply-comment">'];
	for(var i = 0, len = comments.length; i < len; i++) {
		var comment = comments[i];
		htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
	}
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
	var htmlText = [];
	htmlText.push('<div class="reply-zone">');
	htmlText.push(likesHtmlTpl(replyData.likes));
	htmlText.push(commentsHtmlTpl(replyData.comments));
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
	var htmlText = [];
	htmlText.push('<ul class="item-pic">');
	for(var i = 0, len = pics.length; i < len; i++) {
		htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
	}
	htmlText.push('</ul>');
	return htmlText.join('');
}

/**
 * 分享消息模板
 * @param {Object} pics 多图片消息的图片列表
 *  @return {String} 返回html字符串
 */
function shareMsgTpl(pic, title) {
	var htmlText = [];
	htmlText.push('<div class="item-share">');
	htmlText.push('<img class="pic-small" src="' + pic + '">');
	htmlText.push('	<span class="article-title">' + title + '</span>');
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 单图片消息模板
 *  @param {Object} pics 多图片消息的图片列表
 *  @return {String} 返回html字符串
 */
function onePicTpl(pic) {
	var htmlText = [];
	htmlText.push('<div class="item-pic">');
	htmlText.push('<img class="pic-big" src="' + pic + '">');
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 无图片消息模板
 *  @param {Object} pics 多图片消息的图片列表
 *  @return {String} 返回html字符串
 */
function noPicTpl() {
	var htmlText = [];
	return htmlText.join('');
}
/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */
function messageTpl(messageData, i) {
	var user = messageData.user;
	var content = messageData.content;
	var htmlText = [];
	htmlText.push('<div class="moments-item" data-index="' + i + '">');
	// 消息用户头像
	htmlText.push('<a class="item-left" href="#">');
	htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
	htmlText.push('</a>');
	// 消息右边内容
	htmlText.push('<div class="item-right">');
	// 消息内容-用户名称
	htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
	// 消息内容-文本信息
	htmlText.push('<p class="item-msg">' + content.text + '</p>');
	// 消息内容-图片列表 
	var contentHtml = '';
	// 目前只支持多图片消息，需要补充完成其余三种消息展示
	switch(content.type) {
		// 多图片消息
		case 0:
			contentHtml = multiplePicTpl(content.pics);
			break;
		case 1:
			// TODO: 实现分享消息
			contentHtml = shareMsgTpl(content.share.pic, content.share.text);
			break;
		case 2:
			// TODO: 实现单张图片消息
			contentHtml = onePicTpl(content.pics[0]);
			break;
		case 3:
			// TODO: 实现无图片消息
			contentHtml = noPicTpl();
			break;
	}
	htmlText.push(contentHtml);
	// 消息时间和回复按钮
	htmlText.push('<div class="item-ft">');
	htmlText.push('<span class="item-time">' + content.timeString + '</span>');
	htmlText.push('<div class="item-reply-btn" reply-btn-index="' + i + '">');
	htmlText.push('<span class="item-reply"></span>');
	htmlText.push('</div></div>');
	// 消息回复模块（点赞和评论）
	htmlText.push(replyTpl(messageData.reply));
	htmlText.push('</div></div>');
	return htmlText.join('');
}
/**
 * 页面渲染函数：render
 */
function render() {
	// TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
	var messageHtml = "";
	for(var i = 0; i < data.length; i++) {
		messageHtml += messageTpl(data[i], i);
	}
	$momentsList.html(messageHtml);
}
/**
 * 点赞/评论面板模板：panelTpl
 */
function panelTpl(sign) {
	var htmlText = [];
	htmlText.push('<div class="item-panel">');
	htmlText.push('<div class="icon-praise">');
	if(sign == 'unlike') {
		htmlText.push('<span class="unlike-icon"></span>');
	} else {
		htmlText.push('<span class="like-icon"></span>');
	}
	htmlText.push('</div>');
	htmlText.push('<a href="javascript:;" class="comm-icon"></a>');
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 点击回复按钮事件函数：replyBtn
 */
function replyBtn(e) {
	e.stopPropagation();
	$(".item-panel").remove();
	if($(this).attr('state') == 'true') {
		var userIndex = $(this).attr('reply-btn-index');
		var res = data[userIndex].reply.likes.some(function(item) {
			return item == userName;
		});
		var sign = !res ? 'like' : 'unlike';
		$(this).before(panelTpl(sign));
		$('.like-icon').on('click', likeBtn);
		$('.unlike-icon').on('click', unlikeBtn);
		$('.comm-icon').on('click', commonBtn);
		$(".item-panel").animate({
			"right": 36
		}, 200);
		$(".item-reply-btn").attr('state', true);
		$(this).attr('state', false);
	} else {
		$(this).siblings(".item-panel").remove();
		$(this).attr('state', true);
	}
}
/**
 * 点击点赞按钮事件函数：likeBtn
 */
function likeBtn() {
	var userIndex = $(this).parent().parent().next().attr('reply-btn-index');
	var res = data[userIndex].reply.likes.some(function(item) {
		return item == userName;
	});
	if(!res) {
		data[userIndex].reply.likes.push(userName);
		init();
	}
}
/**
 * 点击取消赞按钮事件函数：unlikeBtn
 */
function unlikeBtn() {
	var userIndex = $(this).parent().parent().next().attr('reply-btn-index');
	data[userIndex].reply.likes.pop(userName);
	init();
}
/**
 * 点击评论按钮事件函数：commonBtn
 */
function commonBtn() {
	$('.input-box').show();
	var userIndex = $(this).parent().next().attr('reply-btn-index');
	console.log(userIndex);

	$('.send-msg').one('click', function() {
		var inputVal = $('.input-msg').val();
		if(inputVal == "") {
			$('.input-box').hide();
		} else {
			$('.input-msg').val("");
			$('.input-box').hide();
			data[userIndex].reply.comments.push({
				author: userName,
				text: inputVal
			});
			init();
		}
	});
}
/**
 * 点击图片放大函数：bigPicDisplay
 */
function bigPicDisplay(e) {
	e.stopPropagation();
	$('.full-pic').show();
	$('.full-pic').children().attr('src', $(this).attr('src'));
	$('.full-pic').css("margin-left", -$('.full-pic').outerWidth() / 2 + "px");
}
/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
	// TODO: 完成页面交互功能事件绑定
	$(".item-reply-btn").attr('state', true);
	$(".item-reply-btn").on('click', replyBtn);
	$(document).on('click', function() {
		$('.full-pic').hide();
		$(".item-panel").animate({
			"right": -216
		}, 200);
		$(".item-reply-btn").attr('state', true);
	});
	$('.pic-item').on('click', bigPicDisplay);
	$('.pic-big').on('click', bigPicDisplay);

}
/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
	// 渲染页面
	$('.header-user .user-name').html(userName);
	render();
	bindEvent();
}

init();