var express = require('express');
var router = express.Router();
const firebase = require('firebase');
var io = null;

router.post('/user-register', function (req,res,next) {
    if (!req.body.email)
        res.json({ success: false, message: 'You must provide an email' }); // Return error

    if (!req.body.password)
        res.json({ success: false, message: 'You must provide a password' }); // Return error
    else {
        var email = req.body.email;
        var password=req.body.password;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((authData) => {
                firebase.database().ref('users/'+authData.user.uid).set({
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.address,
                    phone: req.body.phone,
                    mid: req.body.mid,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                });
                console.log("User created successfully");

                res.json({ success: true, message: "User created successfully"});
                //Write code to use authData to add to Users
            }).catch((error) => {
            res.json({ success: false, message: error.message }); // Return error
        })
    }
});

router.post('/get-users',function (req,res,next) {
    var mid = req.body.mid;
    firebase.database().ref("users").orderByChild('mid').equalTo(mid).once("value", function(snapshot) {
        result=[];
        snapshot.forEach(function(data) {
            var a = data.val();
            a.uid = data.key;
            result.push(a);
        });
        res.json(result);
    });
})

router.post('/delete-user',function (req,res,next) {
    var uid = req.body.uid;
    firebase.database().ref('users/'+uid).remove(error => {
        if(error==null)
            res.json({ success: true, message: "User deleted successfully"});
        else
            res.json({ success: false, message: error.message });
    })
})

router.post('/edit-user',function (req,res,next) {
    firebase.database().ref('users/'+req.body.uid).update({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        mid: req.body.mid,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    },error => {
        if(error==null)
            res.json({ success: true, message: "User edited successfully"});
        else
            res.json({ success: false, message: error.message });
    })
})


module.exports = {router: router}

