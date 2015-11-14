require('./config/protos')

var express = require('express')
var path = require('path')

global.ROOT = __dirname
global._ = require('lodash')
global.async = require('async')
global.log = require('./lib/logger.js').init()

var app = express();
var session = require('express-session')

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 60000, /*secure: true*/ }}))
app.set('views', path.join(__dirname, 'api/views'));
app.set('view engine', 'ejs');
app.use( require('body-parser').json() );   

app.use(require('body-parser').urlencoded({     
  extended: true
})); 

app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('method-override')('X-HTTP-Method-Override'));

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

app.use(passport.initialize());
app.use(passport.session());
app.use(express.Router());

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

var services = require('./config/custom/services.js').init()
Object.keys(services).forEach(function(index){
  global[index] = appServices[index]
}) 

/**
* Routes Setup
*/

require('./config/custom/routes.js').init(app, policies)

/**
* Models Setup
*/

var Waterline = require('waterline')
var orm = new Waterline()
orm = require('./config/custom/models.js').init(Waterline, orm)

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

  require('./config/bootstrap.js').bootstrap(function(){
    var server = app.listen(process.env.PORT || PORT || 1338, function(){
      //server.setMaxListeners(0);
      
      var host = 'localhost'
      var port = server.address().port

      console.log('listening at http://%s:%s', host, port)
    })
  })
})
