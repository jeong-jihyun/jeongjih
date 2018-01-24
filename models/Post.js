var mongoose = require('mongoose'); 

var postSchema 	= mongoose.Schema({
			title: {type:String, required:true},
			body: {type:String, required:true},
			author : {type: mongoose.Schema.Types.ObjectId, ref:'user', required: true},
			createAt: {type:Date, default:Date.now},
			updateAt: Date
		});
var Board 		= mongoose.model('post', postSchema);

module.exports = Board;