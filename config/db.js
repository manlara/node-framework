/**
* To setup the db using a url 
* 	mongo:{
* 		adapter: 'mongo',
*    	url: 'mongodb://mac:63848687200Ar@ds035593.mongolab.com:35593/heroku_x7n2bckj'
*    }
*/

module.exports = {
	mongo : {
     	adapter: 'mongo',
 	    host: 'localhost',
 	    user:'',
	   	password:'',
		port:27017,
        database: 'test-db'
    },

    config : {
    	adapters: {
    		'default': require('sails-mongo'),
     		mongo: require('sails-mongo'),
  		},
  		defaults: {
    		migrate: 'safe'
  		}
    }
}