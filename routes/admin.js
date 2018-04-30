var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectID = require('mongodb').ObjectID;

//get all Tasks
router.get('/alltasks', function (req,res,next) {
    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        else{
            console.log("connected to DB");

            db.db('MongoDB').collection('users').find().toArray(function (mongoError, objects) {
                if(mongoError)
                    res.send(mongoError);
                res.json(objects);

                db.close();
                console.log("Connection with DB close");
            });

        }

    });
});

//updatestatus Task
router.put('/update/:user', function (req,res,next) {

    var task = req.body;
    var user=req.params.user;

    MongoClient.connect(url, function (err, db) {
        if (err)
            res.send(err);
        db.db("MongoDB").collection('users').updateOne(
            { name: user, "tasks._id": ObjectID(task._id)},
            { $set: { "tasks.$.isDone" : task.isDone} },function (mongoError, objects){
                if (mongoError)
                    res.send(mongoError);
                res.json(objects);

                db.close();
            });

    });
});



module.exports = {router: router}