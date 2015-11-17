/*
var mongoose = require('mongoose');
var dbInfo = require('../db.js')

module.exports = {
	init:function(cb){
		//start mongoose conncetion with params
		mongoose.connect('mongodb://'+dbInfo.mongo.user+':'+dbInfo.mongo.password+'@'+dbInfo.mongo.host+':'+dbInfo.mongo.port+'/'+dbInfo.mongo.database);
		var db = mongoose.connection;
		//check if it errors
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function () { //OPEN!!
			return cb(db)
		})
	}
}
*/