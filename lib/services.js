var fs = require('fs');

module.exports = {
	init:function(){
		var main = {}
	
		//read all models in folder
		var services = fs.readdirSync(ROOT+'/api/services')

		services.forEach(function(service){
			var _service = _.clone(service)

			//check if it is a js file
			if(_service.indexOf('.js') !== -1){

				//get the attributes and domain specific functions
				var serviceObj = require(ROOT+'/api/services/'+service)
				var name = _service.split('.js').shift() //Service name
				main[name] = serviceObj
			}
		})

		return main
	}
}