var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var app = express();
// app.get('/',function(req,res){
	// res.send('Hello World!');
// });

// app.use(express.static(__dirname+'/public'));
// ///////////////////////////////////////////////////////
// console.log("DB Start!!");
mongoose.connect('mongodb://jeongjih:Wjdrjsgh0717@ds111138.mlab.com:11138/azure0804');

var db = mongoose.connection;

db.once("open",function(){
	console.log("DB Connected!");
});

db.on("error",function(err){
	console.log("DB Error :", err);
});

var schema = mongoose.Schema({
	name: String,
	count:Number
});

var Data = mongoose.model('data',schema);
// ///////////////////////////////////////////////////////
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));

console.log(__dirname);

var data = {count:0};

app.get("/",function(req,res){
	// data.count++;
	Data.findOne({name:'myData'},function(err, data){
		if (err) return console.log('Data Error:', err);
		//if (!data){
		//	Data.create({name:'myData', count:0},function(err, data){
		//		if (err) return console.log('Data Error:', err);
		//		console.log('Counter initalized :'+ data);
		//	});
		//}
		data.count++;
		data.save(function(err){
			if (err) return console.log('Data Error: ', err);
			res.render("first",data);
		});
		//
	});	
});

app.get("/reset",function(req,res){
	setCounter(res,0);
});

app.get("/set/count",function(req,res){
	if(req.query.count) setCounter(res,req.params.num);
	else getCounter(res);
});

app.get("/set/:num",function(req,res){
	if(req.params.num) setCounter(res,req.params.num);
	else getCounter(res);
});

app.listen(3000, function(){
	console.log('Server On!');
});

function setCounter(res,num){
	console.log('setCounter');
	Data.findOne({name:'myData'},function(err,data){
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
	Data.findOne({name:'myData'},function(err,data){
		if (err) return console.log('Data Error:',err);
		res.render('first',data);
	});
}