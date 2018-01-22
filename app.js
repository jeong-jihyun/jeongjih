var express = require('express'); // sudo npm install --save express
var path = require('path');
var mongoose = require('mongoose'); // sudo npm install --save mongoose
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); // sudo npm install --save method-override

var app = express();
// sudo npm install ejs --save
// sudo npm install -g nodemon
// sudo npm install -save body-parser

// app.get('/',function(req,res){
	// res.send('Hello World!');
// });

// app.use(express.static(__dirname+'/public'));
// ///////////////////////////////////////////////////////
// console.log("DB Start!!");
mongoose.connect(process.env.MONGO_DB);

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

var cData = mongoose.model('data',schema);

// ///////////////////////////////////////////////////////
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// ///////////////////////////////////////////////////////


console.log(__dirname);
// model setting[s]
var postSchema = mongoose.Schema({
			title: {type:String, required:true},
			body: {type:String, required:true},
			createAt: {type:Date, default:Date.now},
			updateAt: Date
		});
var pPost = mongoose.model('post', postSchema);

// model setting[e]

// route setting[s]
app.get('/posts',function(req,res){
	pPost.find({}).sort('-createAt').exec(function(err,posts){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,data:posts});
		res.render("posts/index",{data:posts});
	})
});

app.get('/posts/new', function(req, res){
	res.render("posts/new");
});

app.post('/posts',function(req,res){
	console.log(req.body);

	pPost.create(req.body.post,function(err,post){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,data:post});
		res.redirect('/posts');
	})
}); // create

app.get('/posts/:id',function(req,res){
	pPost.findById(req.params.id, function(err,post){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,data:post});
		res.render("posts/show", {data:post})
	})
});

app.get('/posts/:id/edit',function(req,res){
	pPost.findById(req.params.id, function(err,post){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,data:post});
		res.render("posts/edit", {data:post})
	})
});

app.put('/posts/:id',function(req,res){
	req.body.post.updaeAt = Date.now();

	pPost.findByIdAndUpdate(req.params.id, req.body.post,function(err,post){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,message:post._id+" updated"});
		res.redirect('/posts/'+ req.params.id);
	})
}); // update

app.delete('/posts/:id',function(req,res){
	pPost.findByIdAndRemove(req.params.id,function(err,post){
		if(err) return res.json({success:false, message:err});
		//res.json({success:true,message:post._id+" deleted"});
		res.redirect('/posts');
	})
});
// route setting[e]
// ///////////////////////////////////////////////////////





// ///////////////////////////////////////////////////////
var data = {count:0};

app.get("/",function(req,res){
 	cData.findOne({name:'myData'},function(err, data){
 		if (err) return console.log('Data Error:', err);
 		data.count++;
 		data.save(function(err){
 			if (err) return console.log('Data Error: ', err);
 			res.render("first",data);
 		});
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

function setCounter(res,num){
	console.log('setCounter');
	cData.findOne({name:'myData'},function(err,data){
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
	cData.findOne({name:'myData'},function(err,data){
		if (err) return console.log('Data Error:',err);
		res.render('first',data);
	});
}
// ///////////////////////////////////////////////////////
app.listen(3000, function(){
	console.log('Server On!');
});