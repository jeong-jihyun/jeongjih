var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var app = express();
// app.get('/',function(req,res){
	// res.send('Hello World!');
// });

// app.use(express.static(__dirname+'/public'));
// ///////////////////////////////////////////////////////
console.log("DB Start!!");
mongoose.connect('mongodb://');
var db = mongoose.connection;

db.once("open",function(){
	console.log("DB Connected!");
});

db.on("error",function(err){
	console.log("DB Error :", err);
});

// ///////////////////////////////////////////////////////
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));

console.log(__dirname);

var data = {count:0};

app.get("/",function(req,res){
	data.count++;
	res.render("first",data);
});

app.get("/reset",function(req,res){
	data.count =0;
	res.render("first",data);
});

app.get("/set/count",function(req,res){
	if(req.query.count) data.count = req.query.count;
	res.render("first",data);
});

app.get("/set/:num",function(req,res){
	data.count = req.params.num;
	res.render("first", data);
});

app.listen(3000, function(){
	console.log('Server On!');
});