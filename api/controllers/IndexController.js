var passport = require('passport');

module.exports = {
	index : function (req, res){
		return res.render('index')
	},

	login : function(req, res){
		$.User.findOne({email:req.body.email}).exec(function(err, user){

			passport.authenticate('local', function(err, user, info){
	            if (err){
	              res.set('error','DB Error');
	              res.send(500,'Something went wrong!');
	              return
	            } else if (!user){
	                res.set('error','email or password is incorrect');
	                res.send(404,'email or password is incorrect');
	                return;
	            }

	            req.logIn(user, function(err){
	                if (err){
	                  res.set('error','Log In Failed');
	                  req.session.user = null;
	                  res.send(500, { error: 'Log In Failed' });
	                  return
	                } else{
	                    res.send(user);
	                }
	            });
	        })(req, res);
	    })
	}
}