const _             = require('lodash');
const e             = require('../exception/error');
const Worker        = require('worker-middleware').Worker;
const cd            = require('../../code/statusCode.json')['error'];
const post         = require('./post');

const v             = require('../validate');

exports = module.exports = {};
exports.run = run;

function validate(event , type){
	return function (context, next){
		if(type=="search")
		{
			var rule = [
				[["postId","id","name","email","body"], "safe", 502],
			];
			var check = v.validate(event, rule ,context ,"get");
			if(check)
				return next();
			else
				return next(502)
		}
		var check = v.validate(event, rule ,context ,"post");

		if(check)
			next();
		else
			next(502)
	}
}


function getPostList(event) {
	return new Promise(function(success,fail){
		var w = new Worker();
		w.do(post.getCommentList());;
		w.do(post.getPostList());;
		w.do(post.formData());;
		w.run(function (context, err) {
			let response = {};
			if (err) {
				if(err==502)
					response = {
						errorMessage : context.vresponse
					};
				else
					response = {
						errorMessage : {
							code : err,
							message : cd[err],
						}
					};
			}else{
				response = {
					data     : context.data,
				};
			}

			// console.log("done "+ new Date());
			success(response);
		});
	});
};


function search(event) {
	return new Promise(function(success,fail){
		var w = new Worker();
		w.do(validate(event,"search"));
		w.do(post.getCommentListSearch());
		// w.do(post.searchData());
		w.run(function (context, err) {
			let response = {};
			if (err) {
				if(err==502)
					response = {
						errorMessage : context.vresponse
					};
				else
					response = {
						errorMessage : {
							code : err,
							message : cd[err],
						}
					};
			}else{
				response = {
					data     : context.data,
				};
			}

			// console.log("done "+ new Date());
			success(response);
		});
	});
};


function run(type,event) {
	switch(type) {
		case "getPostList":
			return getPostList(event);
		case "search":
			return search(event);
		default:
			return new Promise(function(success,fail){
				return success({
					errorMessage : {
						code    : 503,
						message : cd[503],
					}
				});
			});
			break;
	}
}


