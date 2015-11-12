var routes = require('../routes.js');

module.exports = {
	init:function(app, policies){

		//loop thru routes
		Object.keys(routes).forEach(function(route){

	  		var _route = _.clone(route.trim())
		  	_route = _route.split(' ')

		  	var result = _.clone(routes[route])
		  	result = result.split('.')

		  	//check if the user input was not all fuked
		  	if(_route.length === 2 && result.length === 2){

		  		//get method, url, controller, and action
			    var method = _route.shift()
			    var url = _route.shift()

			    var controller = result.shift()
			    var action = result.shift()

			    var controllerObj = require('../../api/controllers/'+controller+'.js')

			    //Check if we got a contrller and said controller has said action
			    if(controllerObj && controllerObj[action]){
			    	//bind route

			    	var wasFound = false
			    	var hasFunc = function(req, res, next){
			    		
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