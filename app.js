var express = require('express'); 
var app = express();
var path = require('path');
var mongoose = require('mongoose'); 
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var async = require('async');

var bodyParser = require('body-parser');
var methodOverride 	= require('method-override'); 
var bcrypt = require('bcrypt-nodejs');

// ///////////////////////////////////////////////////////
// sudo npm install --save express
// sudo npm install --save mongoose
// sudo npm install --save method-override
// sudo npm i passport passport-local express-session connect-flash async --save-dev
// sudo npm install ejs --save
// sudo npm install -g nodemon
// sudo npm install -save body-parser
// sudo npm install bcrypt-nodejs --save-dev
// ///////////////////////////////////////////////////////


// app.get('/',function(req,res){
	// res.send('Hello World!');
// });
// 
// ///////////////////////////////////////////////////////

// database
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open",function(){
	console.log("DB Connected!");
});
db.on("error",function(err){
	console.log("DB Error :", err);
});
// view engine
app.set("view engine","ejs");
// app.use(express.static(__dirname+'/public'));

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

// passport
// app.use(session({secret:'MySecret'}));

// passport
var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use('/', require('./routes/home'));
app.use('/login', require('./routes/login'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

console.log(__dirname);

app.listen(3000, function(){
	console.log('Server On!');
});