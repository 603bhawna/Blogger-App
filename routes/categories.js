var express = require('express');
var router = express.Router();
var Post = require('../models/post')
var Category = require('../models/category')

router.get('/add',function(req,res,next){
    res.render('addcategory',{title:'Add Category'})
})

router.post('/add',function(req,res,next){
    var category=new Category()
    category.name=req.body.name
    console.log(req.body.name)
    console.log(Category.name)
    req.checkBody('name','Name Field is required').notEmpty()
     var errors=req.validationErrors()
     if(errors){
         console.log('err')
         res.render('addpost',{errors:errors})
     }
     else{
        category.save(function(err,doc){
            if(err){
                console.log(err)
                res.send(err);
            }else{
                console.log(doc)
                req.flash('success','Category Added');
				//res.location('/');
				res.redirect('/');
            }
        })
     }
})

router.get('/show/:category',function(req,res,next){
    Post.find({category:req.params.category},{},function(err,posts){
        res.render('index',{
        title:req.params.category,
        posts:posts
        })
    })
})

module.exports = router;