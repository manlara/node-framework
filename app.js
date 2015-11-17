require('./config/protos')

var express = require('express')
var app = express();
var path = require('path')
var _$ = {app : app, express : express}

global.ROOT = __dirname
global._ = require('lodash')
global.async = require('async')
global.log = require('./lib/logger.js').init()

var viewPath = path.join(__dirname, 'api/views')
var partialsPath = viewPath
var handlebars  = require('express-handlebars');
var settings = require('./config/settings.js')

_$.app.set('views', viewPath);
_$.app.set('view engine', 'ejs');
_$.app.engine('ejs', handlebars({extname: '.ejs', layoutsDir : viewPath, partialsDir : partialsPath, defaultLayout: 'layout'}));
_$.app.use(express.static(path.join(__dirname, 'public')));

/**
* Middleware setup
*/

require('./lib/middleware.js').init(_$)

/**
* Policies Setup
*/

var policies = require('./lib/policies.js').init()

/**
* Constants Setup
*/

var consts = require('./config/constants.js')
Object.keys(consts).forEach(function(key){
  global[key] = consts[key]
})

/**
* Services Setup
*/

var services = require('./lib/services.js').init()
Object.keys(services).forEach(function(index){
  global[index] = appServices[index]
}) 

/**
* Routes Setup
*/

require('./lib/routes.js').init(_$.app, policies)

/**
* Models Setup
*/

var Waterline = require('waterline')
var orm = new Waterline()
orm = require('./lib/models.js').init(Waterline, orm)

/**
* DB Setup
*/

var db = require('./config/db.js')
var waterlineConfig = db.config
waterlineConfig.connections = {}

Object.keys(db).forEach(function(key){
  if(key !== 'config') waterlineConfig.connections[key] = db[key]
})

orm.initialize(waterlineConfig, function(err, models) {
  if(err) throw err;

  global.models = models.collections

  /**
  * Repository Setup
  */

  global.$ = require('./api/repositories/RepositoryCollection.js').init()
  global._$ = _$

  //_$.globals = global
  require('./config/bootstrap.js').bootstrap(function(){
    var server =  global._$.app.listen(process.env.PORT || PORT || 1338, function(){
    
      //server.setMaxListeners(0);
      global._$.server = server
      var host = 'localhost'
      var port = global._$.server.address().port

      console.log('listening at http://%s:%s', host, port)
    })
  })
})
