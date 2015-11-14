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
      				colorize: true
    			})
  			],
  			exitOnError: false
		});

		var debuglogger = new winston.Logger({
  			level : 'debug',
  			transports: [
    			new winston.transports.Console({
      				handleExceptions: true,
      				colorize: true
      
    			})
  			],
  			exitOnError: false
		});

		var warnlogger = new winston.Logger({
  			level : 'warn',
  			transports : [
    			new winston.transports.Console({
      				handleExceptions: true,
      				colorize: true
    			})
  			],
  			exitOnError: false
		});

		var errlogger = new winston.Logger({
  			level : 'error',
  			transports: [
				new winston.transports.Console({
      				handleExceptions: true,
      				colorize: true,
      				json: true
    			})
  			],
  			exitOnError: false
		});

		return {
			'info' : infologger,
			'debug' : debuglogger,
			'warn' : warnlogger,
			'error' : errlogger
 		}
	}
}