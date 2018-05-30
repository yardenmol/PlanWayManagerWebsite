var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var old_tasks = require('./routes/tasksOld');
var authentication = require('./routes/authentication');
var admin = require('./routes/admin');
//new
var firebase_auth = require('./routes/firebaseAuthentication');
var users_management = require('./routes/usersManagement');
var destinations_management= require('./routes/destinations');
<<<<<<< HEAD
var tasks = require('./routes/tasks');

=======
var clustering_management = require('./routes/clustering');
>>>>>>> a193bbc3a1abcfe39b4fc942678a9146627fed86
var cors = require('cors');
var app = express();
const firebase = require('firebase');
// Initialize Firebase
const config = {
    apiKey: "AIzaSyA5_1kW95h7CKlB0NmJUQndZBeVV9s5RVc",
    authDomain: "planaway-9b6dc.firebaseapp.com",
    databaseURL: "https://planaway-9b6dc.firebaseio.com",
    projectId: "planaway-9b6dc",
    storageBucket: "planaway-9b6dc.appspot.com",
    messagingSenderId: "1064721365270"
};
firebase.initializeApp(config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
app.use(cors({origin: 'http://localhost:4200'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/dist')));

//bodyParser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', index);
app.use('/api',old_tasks.router);
app.use('/authentication', authentication);
app.use('/admin',admin.router);


app.use('/fauthentication', firebase_auth.router);
app.use('/users-management', users_management.router);
app.use('/destinations' , destinations_management.router);
<<<<<<< HEAD
app.use('/tasks' , tasks.router);

=======
app.use('/clustering' , clustering_management.router);
>>>>>>> a193bbc3a1abcfe39b4fc942678a9146627fed86
module.exports = app;
