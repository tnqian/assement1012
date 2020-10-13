const code = require('../code/statusCode.json')['error'];
const _    = require('lodash');
const e    = require('./exception/error');

module.exports = {
	validate: function(request, param , context ,type) {
		var success = true;
		if(type=='get')
			var query = request.query;
		else
			var query = request.body || {};

		_.each(param, function(obj,key){
			if(obj[1]=="required")
			{
				_.each(obj[0], function(value,key){
					var needed  = '';
					if(type=='get')
						needed = query[value];
					else{
						needed = query[value];
					}

					if(_.has(query, value))
					{
						if(_.isUndefined(needed) || _.isNull(needed) || needed == '' )
						{
							var msg = e.msg(obj[2],value);
							e.exception('param',obj[2],msg);
							context.vresponse = {
									code : obj[2],
									message : msg,
							};
							return success = false;
						}
					}
					else
					{
						var msg = e.msg(obj[2],value);
						e.exception('param',obj[2],msg);
						context.vresponse = {
								code : obj[2],
								message : msg,
						};
						return success = false;
					}
					context[value] = needed;
				});
			}else if(obj[1]=="safe"){
				_.each(obj[0], function(value,key){
					var needed  = '';
					if(type=='get')
						needed = query[value];
					else{
						needed = query[value];
					}

					if(_.has(query, value))
					{
						if(!_.isUndefined(needed) || _.isNull(needed)  || needed == '' )
						{
							context[value] = needed;
						}else
							context[value] = '';
					}
					else
						context[value] = '';
				});
			}
		});
		return success ;
	},
};