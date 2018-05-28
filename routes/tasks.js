var express = require('express');
var router = express.Router();

const firebase = require('firebase');

router.get('/add-task', function (req,res,next) {
    var task = { mid: "JjBj9heumraFABJ2rtgg9I1qELu2",
                 uid: "j21l3zi74dWSSeDrAPWnfBCPGGy1",
                 date: new Date().toLocaleDateString(),
                 destinations: [{did: "-LCxfdU6nxx9WvKKKoLN", isDone: true},
                                {did: "-LCxgGbGE_S3eQHN3C6i", isDone: false}]}
    firebase.database().ref('tasks').push(task)
})

router.post('/tasks-of-manager', function (req,res,next) {

    var COUNT = 0;
    result=[];
    function whenFinishDest(i, size, user, j, usersSize) {
        if(i == size){
            result.push(user);
            console.log(user);
            whenFinish(j, usersSize);
        }
    }

    function whenFinish(j, usersSize) {
        COUNT++;
        if(COUNT == usersSize)
            res.json(result);
    }

    var mid = req.body.mid;
    firebase.database().ref("tasks").orderByChild('date').equalTo('2018-5-28').once("value", function(snapshot) {
        var j = 0;
        var usersSize = 3;
        snapshot.forEach(function(data) {
            ret = data.val();
            if(ret.mid == mid){
                var user = {};
                user.mid = ret.mid;
                user.uid = ret.uid;
                user.tid = data.key;
                user.destinations = [];


                //get the user name
                firebase.database().ref("users").orderByKey().equalTo(ret.uid).once("value", function (users) {
                    users.forEach(function (u) {
                        user.name = u.val().name;
                        user.latitude =  u.val().latitude;
                        user.longitude = u.val().longitude;
                    })
                    //get list of destinations names
                    var i = 0;
                    var size = ret.destinations.length;
                    ret.destinations.forEach(function (dest) {
                        firebase.database().ref("destinations").orderByKey().equalTo(dest.did).once("value", function (dests) {
                            dests.forEach(function (d) {
                                i++;
                                user.destinations.push({name: d.val().name, isDone: dest.isDone});
                                whenFinishDest(i,size, user, j, usersSize);
                            })
                        })
                    })
                })
            }
        });
    });
})



router.post('/manager-pie-data', function (req,res,next) {
    var data=[];
    data[0] = {label:"Done", value:3};
    data[1] = {label:"Not Done", value:3};

    res.json(data);
})


module.exports = {router: router};