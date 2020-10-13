const _         = require('lodash');
const r         = require("request")
r.debug         = true;
var jsonRequest = r.defaults({ json: true });

exports = module.exports = {};
exports.getPostList          = getPostList;
exports.getCommentList       = getCommentList;
exports.formData             = formData;
exports.getCommentListSearch = getCommentListSearch;



function formData() {
	return function (context, next){
		var item = [];
		_.each(context.comment, function (o,k) {
			var size = _.size(o);
			var data = null;

			if(_.isUndefined(context.post[k])){
				jsonRequest.get({ url:`https://jsonplaceholder.typicode.com/posts/${k}`}, function (err, res, res) {
					if (err) {
						console.log("API Error:", err);
						return next(1501);
					}
					data = res;
				});
			}else{
				data = context.post[k];
			}

			item.push({
				post_id                  : data.id,
				post_title               : data.title,
				post_body                : data.body,
				total_number_of_comments : size,
			})
		});

		context.data = _.orderBy(item, function (o) {
				return o.total_number_of_comments;
		}, ["desc"]);
		next();
	}
}

function getCommentList(){
	return function (context, next){
		jsonRequest.get({ url:"https://jsonplaceholder.typicode.com/comments"}, function (err, res, data) {
			if (err) {
				console.log("API Error:", err);
				return next(1501);
			}

			// console.log("\nAPI Result:", JSON.stringify(data,null,1));
			context.comment = _.groupBy(data, 'postId');
			next();
		});
	}
}

function getPostList(){
	return function (context, next){
		jsonRequest.get({ url:"https://jsonplaceholder.typicode.com/posts"}, function (err, res, data) {
			if (err) {
				console.log("API Error:", err);
				return next(1501);
			}

			var item = {};
			_.each(data, function(v,k){
				item[v.id] = v;
			});

			context.post = item;
			next();
		});
	}
}

function getCommentListSearch(){
	return function (context, next){
		jsonRequest.get({ url:"https://jsonplaceholder.typicode.com/comments"}, function (err, res, data) {
			if (err) {
				console.log("API Error:", err);
				return next(1501);
			}

			var item = [];
			if(!_.isNull(context.id) && context.id != '' && !_.isUndefined(context.id)){
				var results = _.filter(data,function(r){
					return r.id == context.id;
				});
				item = _.union(item, results);
			}

			if(!_.isNull(context.postId) && context.postId != '' && !_.isUndefined(context.postId)){
				var results = _.filter(data,function(r){
					return r.postId == context.postId;
				});
				item = _.union(item, results);
			}


			if(!_.isNull(context.name) && context.name != '' && !_.isUndefined(context.name)){
				var results = _.filter(data,function(r){
					return r.name.includes(context.name) == true;
				});
				console.log(results)
				item = _.union(item, results);
			}

			if(!_.isNull(context.email) && context.email != '' && !_.isUndefined(context.email)){
				 var results = _.filter(data,function(r){
					return r.email.includes(context.email) == true;
				});
				item = _.union(item, results);
			}

			if(!_.isNull(context.body) && context.body != '' && !_.isUndefined(context.body)){
				 var results = _.filter(data,function(r){
					return r.body.includes(context.body) == true;
				});
				item = _.union(item, results);
			}

			// console.log("\nAPI Result:", JSON.stringify(data,null,1));
			context.data = item;
			next();
		});
	}
}