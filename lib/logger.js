var winston = require('winston');

module.exports = {

	init : function(){

  	var colors = require(ROOT+'/config/log.js').colors
		winston.addColors(colors);

		var infologger = new winston.Logger({
  			level : 'info',
  			transports: [
    			new winston.transports.Console({
      				handleExceptions: true,
              humanReadableUnhandledException: true,
              prettyPrint : true ,
      				colorize: true
    			})
  			]
		});

		var debuglogger = new winston.Logger({
  			level : 'debug',
  			transports: [
    			new winston.transports.Console({
      				handleExceptions: true,
              humanReadableUnhandledException: true,
              prettyPrint : true ,
      				colorize: true
      
    			})
  			]
		});

		var warnlogger = new winston.Logger({
  			level : 'warn',
  			transports : [
    			new winston.transports.Console({
      				handleExceptions: true,
              humanReadableUnhandledException: true,
              prettyPrint : true ,
      				colorize: true
    			})
  			]
		});

		var errlogger = new winston.Logger({
  			level : 'error',
  			transports: [
				new winston.transports.Console({
      				handleExceptions: true,
      				colorize: true,
              prettyPrint : true ,
              humanReadableUnhandledException: true
    			})
  			]
		});

		return {
			'info' : function(message){ return infologger.info(message)},
			'debug' : function(message){ return debuglogger.debug(message)},
			'warn' : function(message){ return warnlogger.warn(message)},
			'error' : function(message){ return errlogger.error(message)}
 		}
	}
}