var express = require('express');
var router = express.Router();
var Post=require('../models/post')

/* GET home page. */
router.get('/', function(req, res, next) {
	Post.find(function(err, posts){
		console.log(posts)
		res.render('index', {title:'Blog', posts: posts });
	});
});

module.exports = router;
