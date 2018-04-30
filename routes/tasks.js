var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectID = require('mongodb').ObjectID;
var io = null;

//get all Tasks
router.get('/tasks', function (req,res,next) {
    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        else{
            db.db('MongoDB').collection('users').find().toArray(function (mongoError, objects) {
                if(mongoError)
                    res.send(mongoError);
                res.json(objects);

                db.close();
            });

        }

    });
});

//get all Tasks of user
router.get('/usertasks/:id', function (req,res,next) {
    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        else{
            db.db('MongoDB').collection('users').find({_id: ObjectID(req.params.id)}).toArray(function (mongoError, objects) {
                if(mongoError)
                    res.send(mongoError);
                res.json(objects[0].tasks);

                db.close();
            });
        }
    });
});

//save Tasks
router.post('/task',function (req,res,next) {
    var task = req.body.task;
    var id= req.body.id;
    if (!task.name || !(task.isDone + '')) {
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    }
    else{
        MongoClient.connect(url, function(err, db) {
            var newTask={
                _id: ObjectID(),
                name: task.name,
                isDone: task.isDone
            }

            if (err)
                res.send(err);
            db.db('MongoDB').collection('users').updateOne({_id: ObjectID(id)}, {$push:{tasks:newTask}},function(err,object){
                if(err)
                    res.send(err);
                res.json(newTask);
                db.close();
            });

        });
    }

});

//delete Task
router.post('/task/delete', function (req,res,next) {
    var idUser=req.body.uid;
    var idTask=req.body.tid;

    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        db.db('MongoDB').collection('users').updateOne({_id: ObjectID(idUser)}, { $pull:{tasks: {_id: ObjectID(idTask)}}},function(err,object){
            if(err)
                res.send(err);
            else
                res.json(object);
            db.close();
        });
    });
});

//updatestatus Task
router.put('/task/:id', function (req,res,next) {

    var task = req.body;
    var id=req.params.id;

    MongoClient.connect(url, function (err, db) {
        if (err)
            res.send(err);
        db.db("MongoDB").collection('users').updateOne(
            { _id: ObjectID(id), "tasks._id": ObjectID(task._id)},
            { $set: { "tasks.$.isDone" : task.isDone} },function (mongoError, objects){
                if (mongoError)
                    res.send(mongoError);
                res.json(objects);

                db.close();
            });

    });
});

//get locations of user's tasks
router.get('/taskslocations/:id', function (req,res,next) {

    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        db.db('MongoDB').collection('users').find({_id: ObjectID(req.params.id)}).toArray(function (mongoError, objects) {
            if(mongoError)
                res.send(mongoError);
            user_tasks = objects[0].tasks;
            var locations=[];
            for(i in user_tasks){
                locations.push({
                    name: user_tasks[i].name,
                    address: user_tasks[i].address,
                    lat: user_tasks[i].lat,
                    lng: user_tasks[i].lng
                });
            }
            res.json(locations);
            db.close();
        });

    });
});

//get single task
router.post('/task/single',function (req,res,next) {
    var uid = req.body.uid;
    var tid = req.body.tid;

    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        db.db('MongoDB').collection('users').find({_id: ObjectID(uid)}).toArray(function (mongoError, objects) {
                if(mongoError)
                    res.send(mongoError);
                var tasks = objects[0].tasks;
                for(i in tasks){
                    if(tasks[i]._id == tid)
                        res.json(tasks[i]);
                }
                db.close();
        });

    });
});

//edit task
router.post('/task/edit',function (req,res,next) {

    var uid = req.body.uid;
    var tid = req.body.tid;
    var name = req.body.name;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var address = req.body.address;
    var lat = req.body.lat;
    var lng = req.body.lng;

    MongoClient.connect(url, function (err, db) {
        if (err)
            res.send(err);
        db.db("MongoDB").collection('users').updateOne(
            { _id: ObjectID(uid), "tasks._id": ObjectID(tid)},
            { $set: { "tasks.$.name" : name ,"tasks.$.fromDate": fromDate, "tasks.$.toDate": toDate,
                       "tasks.$.address":address, "tasks.$.lat": lat, "tasks.$.lng": lng } },
                function (mongoError, objects){
                    if (mongoError)
                        res.send(mongoError);
                    else
                        res.json(objects);

                    db.close();
                });

    });


});

router.get('/maxtask/:id', function (req,res,next) {
    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        else{
            db.db('MongoDB').collection('users').aggregate([
                { $match: {_id: ObjectID(req.params.id)} },
                { $unwind: "$tasks" },
                { $group: {
                        _id: "$tasks.name",
                        count: { $sum: 1 }
                    }},
                { $sort: {
                        'count': -1
                    }}
            ]).toArray(function (mongoError, objects) {
                if(mongoError)
                    res.send(mongoError);
                if(objects!= "")
                    res.json({empty:false,name:objects[0]._id});
                else
                    res.json({empty:true});
                db.close();
            });

        }

    });
});

//get all grouped by tasks of user
router.get('/userpiedata/:id', function (req,res,next) {
    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        else{
            db.db('MongoDB').collection('users').aggregate([
                { $match: {_id: ObjectID(req.params.id)} },
                { $unwind: "$tasks" },
                { $group: {
                        _id: "$tasks.isDone",
                        count: { $sum: 1 }
                    }}
            ]).toArray(function (mongoError, objects) {
                if(mongoError)
                    res.send(mongoError);

                var data=[];

                if(objects.length == 1){
                    if(objects[0]._id==true)
                        data[0] = {label:"Done", value:objects[0].count};
                    else
                        data[0] = {label:"Not Done", value:objects[0].count};
                }
                else if(objects.length == 2){
                    if(objects[0]._id == true){
                        data[0] = {label:"Done", value:objects[0].count};
                        data[1] = {label:"Not Done", value:objects[1].count};
                    }
                    else{
                        data[0] = {label:"Not Done", value:objects[0].count};
                        data[1] = {label:"Done", value:objects[1].count};
                    }
                }
                res.json(data);

                db.close();
            });
        }
    });
});

//get all grouped by tasks of all users
router.get('/userspiedata', function (req,res,next) {
    MongoClient.connect(url, function(err, db) {
        if (err)
            res.send(err);
        else{
            db.db('MongoDB').collection('users').aggregate([
                { $unwind: "$tasks" },
                { $group: {
                        _id: "$tasks.isDone",
                        count: { $sum: 1 }
                    }}
            ]).toArray(function (mongoError, objects) {
                if(mongoError)
                    res.send(mongoError);

                var data=[];

                if(objects.length == 1){
                    if(objects[0]._id==true)
                        data[0] = {label:"Done", value:objects[0].count};
                    else
                        data[0] = {label:"Not Done", value:objects[0].count};
                }
                else if(objects.length == 2){
                    if(objects[0]._id == true){
                        data[0] = {label:"Done", value:objects[0].count};
                        data[1] = {label:"Not Done", value:objects[1].count};
                    }
                    else{
                        data[0] = {label:"Not Done", value:objects[0].count};
                        data[1] = {label:"Done", value:objects[1].count};
                    }
                }

                res.json(data);

                db.close();
            });
        }
    });
});



//socket io
function setIo(ioObject) {
    io = ioObject;
    io.sockets.on('connection',function (client) {
        console.log('user connected- socket.io message');

        client.on('deleteTask', function (data) {
            console.log("socket-io: "+ data.uid +" "+ data.tid);
            var idUser=data.uid;
            var idTask=data.tid;

            MongoClient.connect(url, function(err, db) {
                if (err)
                    client.emit("deleteTaskResult",err);

                db.db('MongoDB').collection('users').updateOne({_id: ObjectID(idUser)}, { $pull:{tasks: {_id: ObjectID(idTask)}}},function(err,object){
                    if(err)
                        client.emit("deleteTaskResult",err);
                    else{
                        var data ={result:object, tid: idTask};
                        client.emit("deleteTaskResult",data);
                    }
                    db.close();
                });
            });

        });

        client.on('disconnect',function () {
        console.log('client disconnectd- socket.io message');
        });
    });
}





module.exports = {router: router,
                  setIo: setIo}

//module.exports = router;
