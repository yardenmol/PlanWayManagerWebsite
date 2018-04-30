var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var ObjectID = require('mongodb').ObjectID;

//register
router.post('/register', function (req,res,next) {
    if (!req.body.name)
        res.json({ success: false, message: 'You must provide an userName ' }); // Return error

    if (!req.body.password)
        res.json({ success: false, message: 'You must provide a password ' }); // Return error
    else {

        var name = req.body.name;
        var password=req.body.password;

        checkName(name,(boolRes,msg)=>{
            register({name:name , password:password},boolRes,msg,(send)=>{
                res.json(send);
            });
        });
    }
});

//check if the name already exists
function checkName(name,callback) {
    MongoClient.connect(url, function(err, db) {
        if (err)
            callback(false,err.errors.username.message);

        db.db('MongoDB').collection('users').find({"name": name}).toArray(function (mongoError, objects) {  //select * from users where name=user.name
            if(mongoError){
                callback(false,mongoError.errors.username.message);
                console.log(mongoError);
            }
            if(Object.keys(objects).length === 0){ //the query return empty - the name does not exists
                db.close();
                callback(true,null);
            }
            else {
                db.close();
                callback(false,"username is already exists");
            }
        });
    });
}


//user{name, password}
function register(user,prevBool,msg,calbk){
    if (prevBool){

        bcrypt.hash(user.password, null, null,function(err, hash) {
            if (err)
                calbk({ success: false, message: 'Could not save user. Error: '+ err.errors.username.message});
            user.password = hash; // Apply encryption to password

            MongoClient.connect(url, function(err, db) {
                if (err)
                    calbk({ success: false, message: 'Could not connect to DB'});

                db.db('MongoDB').collection('users').insertOne(user, function(mongoError, object) { //insert new user

                    if(mongoError)
                        calbk({ success: false, message: 'Could not save user. Error: '+mongoError.errors.username.message});

                    db.db('MongoDB').collection('users').find({"name": user.name}).toArray(function (mongoError, objects) { //find the id of new user
                        calbk({ success: true, message: 'Acount registered!', id: objects[0]._id });
                        console.log(user.name +" successfully registered");
                        db.close();
                    });
                });
            });
        });
    }
    else{
        calbk({ success: false, message: msg.toString()});
    }
}


router.post('/login', function (req,res,next) {
    if (!req.body.name)
        res.json({ success: false, message: 'You must provide an username' }); // Return error

    if (!req.body.password)
        res.json({ success: false, message: 'You must provide a password' }); // Return error
    else {

        var name = req.body.name;
        var password = req.body.password;

        MongoClient.connect(url, function(err, db) {
            if (err)
                res.json({ success: false, message: 'Could not connect to DB'});

            db.db('MongoDB').collection('users').find({"name": name}).toArray(function (mongoError, objects) { //select * from users where name=user.name
                if(mongoError)
                    console.log(mongoError);

                if(Object.keys(objects).length === 0){ //the query return empty - the name does not exists
                    db.close();
                    res.json({ success: false, message: 'Username does not exist' }); // Return error
                }
                else { //the name is exists
                    var id=objects[0]._id;
                    var hash=objects[0].password;

                    bcrypt.compare(password, hash, function(err, result) { //decode the password
                        if (result){
                            db.close();
                            console.log(name+" login");
                            res.json({ success: true, message: 'login:)', id: id});
                        }
                        else{
                            db.close();
                            res.json({ success: false, message: 'Bad password'}); // Return error
                        }
                    });
                }
            });
        });
    }
});


router.post('/admin', function (req,res,next) {
    if (!req.body.name)
        res.json({ success: false, message: 'You must provide an username' }); // Return error

    if (!req.body.password)
        res.json({ success: false, message: 'You must provide a password' }); // Return error
    else {

        var name = req.body.name;
        var password = req.body.password;

        MongoClient.connect(url, function(err, db) {
            if (err)
                res.json({ success: false, message: 'Could not connect to DB'});

            console.log("connected to DB");
            db.db('MongoDB').collection('admin').find({"name": name}).toArray(function (mongoError, objects) { //select * from users where name=user.name
                if(mongoError)
                    console.log(mongoError);

                if(Object.keys(objects).length === 0){ //the query return empty - the name does not exists
                    db.close();
                    console.log(name+" Admin does not exist");
                    res.json({ success: false, message: 'Admin does not exist' }); // Return error
                }
                else { //the name is exists
                    var id=objects[0]._id;
                    var hash=objects[0].password;

                    if (hash==password){
                        db.close();
                        console.log("Connection with DB close");
                        console.log(name+" login");
                        res.json({ success: true, message: 'login:)', id: id});
                    }
                    else{
                        db.close();
                        console.log("Connection with DB close");
                        res.json({ success: false, message: 'Bad password'}); // Return error
                    }

                }
            });
        });
    }
});



module.exports = router;