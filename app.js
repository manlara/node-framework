var express = require('express');

//var express = require('express');
var path = require('path'); //used to concatenate paths 

//used for request sent to server
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override'); // lets you use PUT and DELETE
var bodyParser = require('body-parser'); //send variables to server
var Waterline = require('waterline')

var passport = require('passport')
      , LocalStrategy = require('passport-local').Strategy;

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

//policies section
  var policies = require('./config/policies.js')
  var controllers = Object.keys(policies)
  var policyFiles = fs.readdirSync('./api/policies')
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

        var func = require('./api/policies/'+value+'.js')
        if(policyFiles.contains(value)) obj = {run:true, controller:controller, index: name, func: func}
      }

      policyResults.push(obj)
    })
  })





//end
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
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(app.router);

  //make express know about the routes
  routes.init(app, policyResults)

  new bootstrap.bootstrap(function(){

    //passport section
      

      // passport.use(new LocalStrategy(
      //   function(username, password, done) {
      //     User.findOne({ username: username }, function (err, user) {
      //       if (err) { return done(err); }
      //       if (!user) {
      //         return done(null, false, { message: 'Incorrect username.' });
      //       }
      //       if (!user.validPassword(password)) {
      //         return done(null, false, { message: 'Incorrect password.' });
      //       }
      //       return done(null, user);
      //     });
      //   }
      // ));


      // passport.serializeUser(function(user, done) {
      //   done(null, user.id);
      // });

      // passport.deserializeUser(function(id, done) {
      //   User.findById(id, function(err, user) {
      //     done(err, user);
      //   });
      // });

    //end


    //module.exports = app;
    var server = app.listen(process.env.PORT || 1338, function(){
      //server.setMaxListeners(0);
      
      var host = 'localhost'
      var port = server.address().port

      console.log('listening at http://%s:%s', host, port)
    })
  })
})
