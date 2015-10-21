var routes = require('../routes.js');

module.exports = {
	init:function(app){

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
			    	app[method](url, controllerObj[action])
			    }
		  	}
		})
	}
}