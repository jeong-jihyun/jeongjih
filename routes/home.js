var express = require('express'); 
var router = express.Router();
var mongoose = require('mongoose'); 
var passport = require('../config/passport.js');
var Counter = require('../models/Counter');

var data = {count:0};
router.get("/",function(req,res){
 	Counter.findOne({name:'myData'},function(err, data){
 		if (err) return console.log('Data Error:', err);
 		data.count++;
 		data.save(function(err){
 			if (err) return console.log('Data Error: ', err);
 			res.render("first",data);
 		});
 	});	
});
 
router.get("/reset",function(req,res){
 	setCounter(res,0);
});
 
router.get("/set/count",function(req,res){
 	if(req.query.count) setCounter(res,req.params.num);
 	else getCounter(res);
});

router.get("/set/:num",function(req,res){
	if(req.params.num) setCounter(res,req.params.num);
	else getCounter(res);
});

router.get('/login', function (req,res){
	res.render('login/login', {email:req.flash('email')[0], loginError: req.flash('loginError')});
});

router.post('/login',function (req,res,next){
	req.flash('email');

	if (req.body.email.length === 0 || req.body.password.length === 0){
		req.flash('email', req.body.email);
		req.flash('loginError', 'Please enter both email and password.');
		res.redirect('/login');
	}else{
		next();
	}
}, passport.authenticate('local-login', {
	successRedirect : '/posts',
	failureRedirect : '/login',
	failureFlash : true
}));
// logout
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

function setCounter(res,num){
	console.log('setCounter');
	Counter.findOne({name:'myData'},function(err,data){
		if (err) return console.log('Data Error:',err);
		data.count= num;
		data.save(function(err){
			if(err) return console.log('Date Error:', err);
			res.render('first',data);
		});
	});
}

function getCounter(res){
	console.log('setCounter');
	Counter.findOne({name:'myData'},function(err,data){
		if (err) return console.log('Data Error:',err);
		res.render('first',data);
	});
}

module.exports = router;