module.exports = function(app, express){
	
	var passport = require('passport')
	var LocalStrategy = require('passport-local').Strategy

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.Router());

	passport.use(new LocalStrategy(
	  function(username, password, done) {
	    $.User.findOne({ username: username }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) {
	        return done(null, false, { message: 'Incorrect username.' });
	      }
	      if (!user.validPassword(password)) {
	        return done(null, false, { message: 'Incorrect password.' });
	      }
	      return done(null, user);
	    });
	  }
	));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  $.User.findOne({id : id}).exec(function(err, user) {
	    done(err, user);
	  });
	});
}