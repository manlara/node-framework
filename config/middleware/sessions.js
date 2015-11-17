module.exports = function(app, express){

	var session = require('express-session')
	var MongoStore = require('connect-mongo')(session);
	var time = 1000 * 60 * 60 * 24 //24hrs
	
	app.use(
		session({ 
			secret: 'keyboard cat', 
			resave: false, 
			saveUninitialized: true, 
			store : new MongoStore({db:'test-db'}), 
			cookie: { maxAge: time, /*secure: true*/ }
		})
	)
}