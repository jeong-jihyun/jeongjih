var express 		= require('express'); 
var app 			= express();
var path 			= require('path');
var mongoose 		= require('mongoose'); 
// restful json 통신
var bodyParser 		= require('body-parser');
var methodOverride 	= require('method-override'); 

var passport 		= require('passport');
var session 		= require('express-session');
var flash 			= require('connect-flash');
var async			= require('async');
// ///////////////////////////////////////////////////////
// sudo npm install --save express
// sudo npm install --save mongoose
// sudo npm install --save method-override
// sudo npm i passport passport-local express-session connect-flash async --save-dev
// sudo npm install ejs --save
// sudo npm install -g nodemon
// sudo npm install -save body-parser
// ///////////////////////////////////////////////////////


// app.get('/',function(req,res){
	// res.send('Hello World!');
// });
// 
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
// ///////////////////////////////////////////////////////
app.set("view engine","ejs");
// app.use(express.static(__dirname+'/public'));
app.use(express.static(path.join(__dirname, 'public')));
// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

// User Information
app.use(session({secret:'MySecret'}));
app.use(passport.initialize());
app.use(passport.session());
// ///////////////////////////////////////////////////////
// passport[s]
passport.serializeUser(function(user,done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});
// passport[e]
// ///////////////////////////////////////////////////////


console.log(__dirname);
// ///////////////////////////////////////////////////////
// model setting[s]
// board model
var postSchema 	= mongoose.Schema({
			title: {type:String, required:true},
			body: {type:String, required:true},
			createAt: {type:Date, default:Date.now},
			updateAt: Date
		});
var pPost 		= mongoose.model('post', postSchema);
// page counter model
var countSchema = mongoose.Schema({
	name: String,
	count:Number
});
var cData 		= mongoose.model('data',countSchema);
// user model
var userSchema	= mongoose.Schema({
	email: {type:String , required:true, unique:true},
	nickname:{type:String , required:true, unique:true},
	password:{type:String , required:true},
	createdAt:{type:Date , default: Date.now}
});
var uData 		= mongoose.model('user',userSchema);
// model setting[e]
// ///////////////////////////////////////////////////////
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