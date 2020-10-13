// error msg
const c = require('../../code/statusCode.json')['error'];

module.exports = {
	exception: function(action,code,msg) {
		var log = {
			action : action,
			code : code ,
			msg : msg,
		}
		// console.log("\n"+JSON.stringify(log,null,1));
	},
	msg: function(code , attribute) {
		var str = c[code];
		return str.replace("{attribute}", attribute);
	}
};
