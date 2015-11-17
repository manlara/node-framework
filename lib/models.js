var fs = require('fs');

module.exports = {
	init:function(Waterline, orm){
		
		var main = {}

		//read all models in folder
		var models = fs.readdirSync(ROOT+'/api/models')

		models.forEach(function(model){
			var _model = _.clone(model)

			//check if it is a js file
			if(_model.indexOf('.js') !== -1){
				var name = _model.split('.js').shift() 

				//get the attributes and domain specific functions
				var modelObj = require(ROOT+'/api/models/'+model)

				modelObj.tableName = name.toLowerCase()
				modelObj.schema = false
				modelObj.connection = 'mongo'
				
		    	var collection = Waterline.Collection.extend(modelObj)
		    	orm.loadCollection(collection)
		    }
		});

		return orm
	}
}