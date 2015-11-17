var fs = require('fs');

module.exports = {

	init : function(){

		var policies = require(ROOT+'/config/policies.js')
	  	var controllers = Object.keys(policies)
	  	var policyFiles = fs.readdirSync(ROOT+'/api/policies')
	  	var policyResults = []

	  	policyFiles.forEach(function(file, key){
	    	file = file.replace('.js', '')
		    policyFiles[key] = file
	  	})
	  
	  	controllers.forEach(function(controller){
	    	var functions = Object.keys(policies[controller])

	    	functions.forEach(function(name){

	      		var value = policies[controller][name]
	      		var obj = {}

	      		if(typeof(value) === "boolean"){

	        		if(value) obj = {run:true, controller:controller, index: name}
	        		else obj = {run:false, controller:controller, index: name}

	      		}else{

	        		var func = require(ROOT+'/api/policies/'+value+'.js')
	        		if(policyFiles.contains(value)) obj = {run:true, controller:controller, index: name, func: func}
	      		}

	      		policyResults.push(obj)
    		})
  		})

  		return policyResults
	}

}