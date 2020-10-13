var express     = require('express');
var router      = express.Router();
const _         = require('lodash');
const p         = require('../form/post');


router.get('/api/post/list', async function(req, response, next) {
	let a = await  p.run('getPostList',req);
	return response.json(a);
});

router.get('/api/comment/search', async function(req, response, next) {
	let a = await  p.run('search',req);
	return response.json(a);
});



module.exports = router;