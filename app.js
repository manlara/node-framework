var express = require('express');

//var express = require('express');
var path = require('path'); //used to concatenate paths 

//used for request sent to server
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override'); // lets you use PUT and DELETE
var bodyParser = require('body-parser'); //send variables to server
var Waterline = require('waterline')

//used to read directries or files
var fs = require('fs');

//global npm's
var _ = require('lodash');
var async = require('async');

//custom files
var db = require('./config/custom/db.js') 
var routes = require('./config/custom/routes.js')
var appModels = require('./config/custom/models.js')
var appServices = require('./config/custom/services.js')

var repositoryCollection = require('./api/repositories/RepositoryCollection.js')

var bootstrap = require('./config/bootstrap.js')
var orm = new Waterline();
var mongoAdapter = require('sails-mongo');
var dbInfo = require('./config/db.js')
var consts = require('./config/constants.js')

require('./config/protos')

var config = {

  // Setup Adapters
  // Creates named adapters that have have been required
  adapters: {
    'default': mongoAdapter,
     mongo: mongoAdapter,
  },

  
  // Setup connections using the named adapter configs
  connections: {},

  defaults: {
    migrate: 'safe'
  }

};

// Build Connections Config
Object.keys(dbInfo).forEach(function(key){
  config.connections[key] = dbInfo[key]
})

global.async = async
global._ = _
Object.keys(consts).forEach(function(key){
  global[key] = consts[key]
})

orm = appModels.init(Waterline, orm)
//start express

var app = express();
var session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

app.use(function(req, res, next){
  next()
})

orm.initialize(config, function(err, models) {
  if(err) throw err;

  //set async and _ as globals
 
  global.custom = {}

  //get all models and place the list in a global var
  global.models = models.collections
  //console.log(models)
  //setup repos
  global.$ = repositoryCollection.init()

  //setup services
  appServices = appServices.init()
  Object.keys(appServices).forEach(function(index){
    global[index] = appServices[index]
  }) 

  // view engine setup
  app.set('views', path.join(__dirname, 'api/views'));
  app.set('view engine', 'ejs');

  // public files setup
  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 

  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(methodOverride('X-HTTP-Method-Override'));

  //make express know about the routes
  routes.init(app)

  new bootstrap.bootstrap(function(){
    //module.exports = app;
    var server = app.listen(process.env.PORT || 1338, function(){
      //server.setMaxListeners(0);
      
      var host = 'localhost'
      var port = server.address().port

      console.log('listening at http://%s:%s', host, port)
    })
  })
})
