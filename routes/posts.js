var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' })

var Post = require('../models/post')
var Category = require('../models/category')

router.get('/add',function(req,res,next){
    Category.find(function(err,categories){
        console.log(categories)
        res.render('addpost',{title:'Add Post',categories:categories})
    })
})

router.post('/add',upload.single('mainimage'),function(req,res,next){
    console.log('dfsd')
    var title=req.body.title
    var contributor=req.body.contributor
    var category=req.body.category
    var body=req.body.body
    var date=new Date()
    console.log(body)
    console.log(title)
    console.log(contributor)
    console.log(category)
    console.log(date)
    console.log(req.file)
    console.log(req.file.filename)
    if(req.file){
        console.log('d')
        var mainimage=req.file.filename
    }
    else{
        console.log('t')
        var mainimage='noimage.jpg'
    }
    console.log(mainimage)
    req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();
    req.checkBody('contributor','Contributor Field is required').notEmpty()
	var errors = req.validationErrors();

	if(errors){
        console.log(errors)
        console.log('errrr')
		res.render('addpost',{
			errors: errors
		});
	} else {
        var post=new Post({
            title:title,
            category:category,
            body:body,
            date:date,
            contributor:contributor,
            mainimage:mainimage
        })
        post.save(function(err,doc){
            if(err){
                console.log(err)
                console.log('err')
                res.send(err);
            }else{
                console.log(doc)
                req.flash('success','Post Added');
                //res.location('/');
				res.redirect('/');
            }
        })
    }
})

router.get('/show/:id',function(req,res,next){
    Post.findById(req.params.id,function(err,post){
        console.log(post)
        res.render('show',{post:post})
    })
})

router.post('/addcomment',function(req,res,next){
    console.log('we')
    var name=req.body.name
    var email=req.body.email
    var body=req.body.body
    var postid=req.body.postid
    var commentdate=new Date()
    console.log(postid)
    console.log(body)
    console.log('we')
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required but never displayed').notEmpty();
	req.checkBody('email','Email is not formatted properly').isEmail();
	req.checkBody('body', 'Body field is required').notEmpty();
    console.log('we')

	var errors = req.validationErrors();
    console.log('we')
	if(errors){
        console.log('dsqw')
		Post.findById(postid, function(err, post){
			res.render('show',{
				"errors": errors,
				"post": post
			});
		});
	} else {
        console.log('try')
        var comment = {
			"name": name,
			"email": email,
			"body": body,
			"commentdate": commentdate
        }
        /*Post.insert(postid,function(err,doc){
            console.log(doc)
            doc.comments=comment
            doc.save(function(err,doc){
                if(!err){
                    console.log('dss')
                    console.log(doc)
                }
            })
        })*/
        Post.update({_id:postid},
            {$push:{comments:comment}},{new:true},function(err,doc){
                if(err){
                    console.log('dds')
                    throw err
                }else{
                    console.log('sd')
                    console.log(doc)
                    req.flash('success', 'Comment Added');
				    //res.location('/posts/show/'+postid);
				    res.redirect('/posts/show/'+postid);
                }
            }
        )
    }
})
module.exports = router;