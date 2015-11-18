
module.exports = {
	init:function(app, policies){

		//loop thru routes
		Object.keys(_$.routes).forEach(function(route){

	  		var _route = _.clone(route.trim())
		  	_route = _route.split(' ')

		  	var result = _.clone(_$.routes[route])
		  	result = result.split('.')

		  	//check if the user input was not all fuked
		  	if(_route.length === 2 && result.length === 2){

		  		//get method, url, controller, and action
			    var method = _route.shift()
			    var url = _route.shift()

			    var controller = result.shift()
			    var action = result.shift()

			    var controllerObj = require(ROOT+'/api/controllers/'+controller+'.js')

			    //Check if we got a contrller and said controller has said action
			    if(controllerObj && controllerObj[action]){
			    	//bind route

			    	var wasFound = false
			    	var hasFunc = function(req, res, next){

			    		var render = res.render, layout = app.locals.settings['view options'].layout
			    		res.view = function(view, options, helpers, fn){

			    			function findController(){
			    				var method = 'get'
			    				for(var i = 0; i < Object.keys(req.route.methods).length; i++){

			    					var _method = Object.keys(req.route.methods)[i]
			    					if(req.route.methods[method]){
			    						method = _method
			    						break
			    					}
								}

								var value = _$.routes[method+' '+req.route.path]
								if(!value) return 

								return value.split('.').shift().toLowerCase().split('controller').shift()
			    			}

			    			var helpersObj = {}
			    			var _helpers = _$.helpers
			    			helpers = helpers || []

			    			if(_helpers.global) Object.keys(_helpers.global).forEach(function(funcName){
		    					helpersObj[funcName] = _helpers.global[funcName]
		    				})

			    			var controller = findController()
		    				if(_helpers[controller]) Object.keys(_helpers[controller]).forEach(function(funcName){

		    					if(!helpers.length) helpersObj[funcName] = _helpers[controller][funcName]
		    					else if(helpers.contains(funcName)) helpersObj[funcName] = _helpers[controller][funcName]
		    				
		    				})

		    				options = options || {}
		    				options = _.extend(options, helpersObj);
			    			render.call(res, view, options, function (err, str) {
			    				if(err) throw err

			    				var _helpers = _$.helpers
			    				var locals = {
			    					body : str
			    				}
			    				locals = _.extend(locals, helpersObj);
			    			
			    				return render.call(res, layout, locals, fn)
			    			})

			    		}

			    		if(req.isAuthenticated) return next()
			    		else {
			    			req.isAuthenticated = function(){
			    				return false
			    			}
			    		}

			    		return next()
			    	}

			    	for(var i = 0; i < policies.length; i++){

			    		if(policies[i].controller === controller && policies[i].index === action){
			    			wasFound = true

			    			if(!policies[i].run){

			    				var notRunFunc = function(req, res, next){
			    					return res.status(404).end()
			    				}

			    				app[method](url, hasFunc, notRunFunc, controllerObj[action])
			    			}else{

			    				if(policies[i].func) app[method](url, hasFunc, policies[i].func, controllerObj[action])
			    				else app[method](url, hasFunc, controllerObj[action])
			    			}

			    			break
			    		}
			    	}

			    	if(!wasFound) app[method](url, hasFunc, controllerObj[action])
			    }
		  	}
		})
	}
}