var express = require('express'); 
var router = express.Router();
var mongoose = require('mongoose'); 
var Board = require('../models/Post');

router.get('/',function(req,res){
	Board.find({}).populate('author').sort('-createAt').exec(function(err,posts){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,data:posts});
		res.render("posts/index",{data:posts, user:req.user});
	})
});

router.get('/new', isLoggedIn, function(req, res){
	res.render("posts/new", {user: req.user});
});

router.post('/', isLoggedIn, function(req,res){
	console.log(req.body);
	req.body.post.author = req.user._id;

	Board.create(req.body.post,function(err,post){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,data:post});
		res.redirect('/posts');
	})
}); // create

router.get('/:id',function(req,res){
	Board.findById(req.params.id).populate('author').exec(function(err,post){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,data:post});
		res.render("posts/show", {data:post,user:req.user})
	})
});

router.get('/:id/edit',isLoggedIn,function(req,res){
	Board.findById(req.params.id, function(err,post){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,data:post});
		if(!req.user._id.equals(post.author)) return res.json({success:false, message: 'Unauthrized Attempt'});
		res.render("posts/edit", {data:post, user:req.user})
	})
});

router.put('/:id',isLoggedIn,function(req,res){
	req.body.post.updaeAt = Date.now();
	//Board.findById(req.params.id, function(err,post){
	//	if(err) return res.json({success:false, message:err});
	//	if(!req.user._id.equals(post.author)) return res.json({success:false, message: 'Unauthrized Attempt'});

		Board.findByIdAndUpdate({_id: req.params.id, author: req.user._id}, req.body.post,function(err,post){
			if(err) return res.json({success:false, message:err});
			//res.json({success:true,message:post._id+" updated"});
			if(!post) return res.json({success:false, message:'No data found to update'});
			res.redirect('/posts/'+ req.params.id);
		});
	//});
}); // update

router.delete('/:id',isLoggedIn,function(req,res){
	//Board.findById(req.params.id, function(err,post){
	//	if(err) return res.json({success:false, message:err});
	//	if(!req.user._id.equals(post.author)) return res.json({success:false, message: 'Unauthrized Attempt'});	
		Board.findByIdAndRemove(req.params.id,function(err,post){
			if(err) return res.json({success:false, message:err});
			//res.json({success:true,message:post._id+" deleted"});
			res.redirect('/posts');
		});
	//});
});

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

module.exports = router;