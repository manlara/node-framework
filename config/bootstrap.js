
module.exports.bootstrap = function(cb){
	seedDb(function(err){
		if(err) log.error(err)
		else return cb()
	})
}

function seedDb(cb){
	var username = 'ml27299', password = '123456'

	var query = {username:username, password : password}
	$.User.findOne({username:username}).exec(function(err, user){
		if(err) return cb(err)
		if(user) return cb()

		$.User.create(query).exec(function(err, user){
			if(err) return cb(err)
			return cb()
		})
	})
}