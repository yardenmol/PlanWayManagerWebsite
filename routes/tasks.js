var express = require('express');
var router = express.Router();
var io = null;

const firebase = require('firebase');

router.get('/add-task', function (req,res,next) {
    var task = { mid: "JjBj9heumraFABJ2rtgg9I1qELu2",
                 uid: "4ET5zo6dbJZ43evcISIHNbAMzc22",
                 // date: "2018-5-28",
                 date: new Date().toLocaleDateString(),
                 destinations: [{did: "-LCy9qdC98JprgWzAPIw", isDone: true},
                                {did: "-LDOo7gwpCHgUxAAHrz1", isDone: false}]}
    firebase.database().ref('tasks').push(task)
});

router.get('/update-task', function (req,res,next) {
    firebase.database().ref('tasks/'+'-LDbcmrRdunIKqO9IfgN').update({
        date: new Date().toLocaleDateString(),
        destinations: [{did: "-LCxfdU6nxx9WvKKKoLN", isDone: true},
                        {did: "-LCxgGbGE_S3eQHN3C6i", isDone: false}],
        mid: "JjBj9heumraFABJ2rtgg9I1qELu2",
        uid: "j21l3zi74dWSSeDrAPWnfBCPGGy1",
    },error => {
        if(error==null)
            res.json({ success: true, message: "User edited successfully"});
        else
            res.json({ success: false, message: error.message });
    });
});


router.get('/update-user', function (req,res,next) {
    firebase.database().ref('users/'+'j21l3zi74dWSSeDrAPWnfBCPGGy1').update({
        name: "Tal Levi",
        email: "tal@gmail.com",
        address: "Tavor 4 Shoham",
        phone: "0524376800",
        mid: "JjBj9heumraFABJ2rtgg9I1qELu2",
        latitude: 31.892773,
        longitude: 34.81127200000003
    },error => {
        // if(error==null)
        //     res.json({ success: true, message: "User edited successfully"});
        // else
        //     res.json({ success: false, message: error.message });
    });

    firebase.database().ref('tasks/'+'-LDbcmrRdunIKqO9IfgN').update({
        date: new Date().toLocaleDateString(),
        destinations: [{did: "-LCxz8-C0-xJKZczHRzX", isDone: true}],
        mid: "JjBj9heumraFABJ2rtgg9I1qELu2",
        uid: "j21l3zi74dWSSeDrAPWnfBCPGGy1",
    },error => {
        // if(error==null)
        //     res.json({ success: true, message: "User edited successfully"});
        // else
        //     res.json({ success: false, message: error.message });
    });
});

router.post('/tasks-of-manager', function (req,res,next) {
    // console.log("router start.");
    // asyncCallSnapshotTasks(req,res);
    // console.log("router end.");

    var COUNT = 0;
    result=[];
    function whenFinishDest(i, size, user, j, usersSize, finishUser) {
        if(i == size && finishUser){
            result.push(user);
            whenFinish(j, usersSize);
        }
    }

    function whenFinish(j, usersSize) {
        COUNT++;
        if(COUNT == usersSize)
            res.json(result);
    }

    var mid = req.body.mid;
    var today = new Date().toLocaleDateString();
    firebase.database().ref("tasks").orderByChild('date').equalTo(today).once("value", function(snapshot) {
        var j = 0;
        var usersSize = 0;
        snapshot.forEach((t)=>{
            if (t.val().mid == mid)
                usersSize++;
        });
        snapshot.forEach(function(data) { // data = some task

            var ret = data.val(); // some task

            if(ret.mid == mid){
                var user = {};
                user.mid = ret.mid;
                user.uid = ret.uid;
                user.tid = data.key;
                user.destinations = [];


                var isFinishUserDetails = false;
                //get list of destinations names
                var i = 0;
                var size = ret.destinations.length;
                ret.destinations.forEach(function (dest) {
                    let _isDone = dest.isDone;
                    firebase.database().ref("destinations").orderByKey().equalTo(dest.did).once("value", function (dests) {
                        dests.forEach(function (d) {
                            i++;
                            user.destinations.push({name: d.val().name, isDone: _isDone});
                            whenFinishDest(i,size, user, j, usersSize, isFinishUserDetails);
                        });
                    });
                });

                //get the user name
                firebase.database().ref("users").orderByKey().equalTo(ret.uid).once("value", function (users) {
                    users.forEach(function (u) {
                        user.name = u.val().name;
                        user.latitude =  u.val().latitude;
                        user.longitude = u.val().longitude;
                        isFinishUserDetails = true;
                        whenFinishDest(i,size, user, j, usersSize, isFinishUserDetails);
                    });
                });
            }
        });
    });
})


//socket io
function setIo(ioObject) {
    io = ioObject;
    io.sockets.on('connection',function (client) {
        // console.log('user connected- socket.io message');

        client.on('getPieData', function (data) {
            console.log("socket-io: " + data.mid);
            var mid = data.mid;
            var data = [];

            var today = new Date().toLocaleDateString();
            firebase.database().ref("tasks").orderByChild('date').equalTo(today).on("value", function (snapshot) {
                var done = 0;
                var notDone = 0;
                snapshot.forEach(function (t) {
                    var task = t.val();
                    if (task.mid == mid) {
                        task.destinations.forEach(function (dest) {
                            if (dest.isDone == true)
                                done++;
                            else
                                notDone++
                        });
                    }
                });
                data[0] = {label: "Done", value: done};
                data[1] = {label: "Not Done", value: notDone};
                client.emit('pieDataResult', data);
            });
        });

        client.on('getTasksOfManager', function (data) {
            getTasksOfManager(data.mid, client);
        })


        client.on('disconnect',function () {
            // console.log('client disconnectd- socket.io message');
        });
    });

}


function getTasksOfManager(mid, client){

    var COUNT = 0;
    var result=[];
    function whenFinishDest(i, size, user, j, usersSize, finishUser) {
        if(i == size && finishUser){
            result.push(user);
            whenFinish(j, usersSize);
        }
    }

    function whenFinish(j, usersSize) {
        COUNT++;
        if(COUNT == usersSize)
            client.emit('TasksOfManagerResult',{success: true, tasks:result});

    }

    var today = new Date().toLocaleDateString();
    firebase.database().ref("tasks").orderByChild('date').equalTo(today).on("value", function(snapshot) {
        COUNT = 0;
        result = [];
        var j = 0;
        var usersSize = 0;
        snapshot.forEach((t)=>{
            if (t.val().mid == mid)
                usersSize++;
        });

        //check if the manager has no tasks for today
        if(usersSize == 0){
            client.emit('TasksOfManagerResult', {success: false});
        }

        snapshot.forEach(function(data) { // data = some task

            var ret = data.val(); // some task

            if(ret.mid == mid){
                var user = {};
                user.mid = ret.mid;
                user.uid = ret.uid;
                user.tid = data.key;
                user.destinations = [];


                var isFinishUserDetails = false;
                //get list of destinations names
                var i = 0;
                var size = ret.destinations.length;
                ret.destinations.forEach(function (dest) {
                    let _isDone = dest.isDone;
                    firebase.database().ref("destinations").orderByKey().equalTo(dest.did).once("value", function (dests) {
                        dests.forEach(function (d) {
                            i++;
                            user.destinations.push({name: d.val().name, isDone: _isDone});
                            whenFinishDest(i,size, user, j, usersSize, isFinishUserDetails);
                        });
                    });
                });

                //get the user name
                firebase.database().ref("users").orderByKey().equalTo(ret.uid).once("value", function (users) {
                    users.forEach(function (u) {
                        user.name = u.val().name;
                        user.latitude =  u.val().latitude;
                        user.longitude = u.val().longitude;
                        isFinishUserDetails = true;
                        whenFinishDest(i,size, user, j, usersSize, isFinishUserDetails);
                    });
                });
            }
        });
    });
}


router.post('/locations-of-users', function (req,res,next) {
    let users = req.body.users;
    let result = [];
    let numOfUsers = users.length;
    let i = 0;

    users.forEach(function (u) {
        firebase.database().ref("users").orderByKey().equalTo(u.uid).once("value", function (snapshot) {
            snapshot.forEach(function (user) {
                i++;
                userVal = user.val();
                result.push({uid: user.key, name: userVal.name,
                                lat: userVal.latitude, lng: userVal.longitude});
                whenFinish(i);
            });
        });

    });

    function whenFinish(index) {
        if(index == numOfUsers){
            res.json(result);
        }
    }

});

module.exports = {router: router,
                  setIo: setIo}


// function syncGetAllTasks() {
//     return new Promise(resolve => {
//         firebase.database().
//         ref("tasks").
//         orderByChild('date').
//         equalTo('2018-5-28').
//         once("value", function(snapshot) {
//             console.log("Muhaha i got the snapshop!!!!");
//             resolve(snapshot);
//         });
//     });
// }
//
// function syncGetUserDetails(uid){
//     return new Promise(resolve=>{
//         firebase.database().
//             ref("users").
//             orderByKey().
//             equalTo(uid).
//             once("value", function (users) {
//                 resolve(users);
//             });
//     });
// }
// async function getTasksAsync(t){
//     let task = t.val();
//     if(tasks.mid == req.body.mid){
//         // construct a user
//         let user = {};
//         user.mid = task.mid;
//         user.uid = task.uid;
//         user.tid = t.key();
//         user.destinations = [];
//         // get all user details
//         let db_user = await syncGetUserDetails(user.uid);
//         user.name = db_user.name;
//         user.latitude = db_user.latitude;
//         user.longitude = db_user.longitude;
//         return user;
//     }
//     else{
//         return null;
//     }
// }
// async function asyncCallSnapshotTasks(req,res) {
//     console.log('calling ... ');
//     var snapshot = await syncGetAllTasks();
//     console.log("-> 2) got all tasks.");
//     let users = [];
//     for(let i =0; i,snapshot.length; ++i){
//        let wtf =  await getTasksAsync(snapshot[i]);
//        if(wtf != null){
//            console.log("pushed user =>  " + wtf.name);
//             users.push(wtf);
//        }
//     }
//     console.log("DONE DONE DONE DONE DONE DONE DONE DONE ");
//     console.log(users);
// }