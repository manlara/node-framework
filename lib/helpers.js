var fs = require('fs');

module.exports = {
	init : function(){

		var path = ROOT+'/api/helpers'
		var helpers = fs.readdirSync(path)
		var returnObj = {}

		helpers.forEach(function(helper){
			var helperObj = require(path+'/'+helper)

			var nameArray = helper.toLowerCase().split('helper')
			if(!nameArray.length || nameArray.length === 1) throw 'Helper file name is not right format'
			
			nameArray.pop()
			var name = nameArray.join('')

			if(!returnObj[name]) returnObj[name] = {}
			returnObj[name] = helperObj
		})

		return returnObj
	}
}