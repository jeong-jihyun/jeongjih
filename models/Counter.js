var mongoose = require('mongoose'); 

var countSchema = mongoose.Schema({
	name: String,
	count:Number
});
var Counter 	= mongoose.model('data',countSchema);

module.exports = Counter;