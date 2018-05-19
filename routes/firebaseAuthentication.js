var express = require('express');
var router = express.Router();
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

router.post('/manager-register', function (req,res,next) {
    if (!req.body.email)
        res.json({ success: false, message: 'You must provide an email' }); // Return error

    if (!req.body.password)
        res.json({ success: false, message: 'You must provide a password' }); // Return error
    else {
        var email = req.body.email;
        var password=req.body.password;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((authData) => {
                console.log("Manager created successfully");
                res.json({ success: true, message: "Manager created successfully", mid:authData.user.uid });
                //Write code to use authData to add to Users
            }).catch((error) => {
            res.json({ success: false, message: error.message }); // Return error
        })
    }
})


router.post('/manager-login', function (req,res,next) {
    if (!req.body.email)
        res.json({ success: false, message: 'You must provide an email' }); // Return error

    if (!req.body.password)
        res.json({ success: false, message: 'You must provide a password' }); // Return error
    else {
        var email = req.body.email;
        var password=req.body.password;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((authData) => {
                console.log("Manager login successfully");
                res.json({ success: true, message: "Login success", mid:authData.user.uid });
                //Write code to use authData to add to Users
            }).catch((error) => {
            res.json({ success: false, message: error.message }); // Return error
        })
    }
})


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
                firebase.database().ref('users/'+authData.user.uid).set(req.body);
                console.log("User created successfully");
                res.json({ success: true, message: "User created successfully", uid:authData.user.uid });
                //Write code to use authData to add to Users
            }).catch((error) => {
            res.json({ success: false, message: error.message }); // Return error
        })
    }
})

router.post('/get-users',function (req,res,next) {
    var mid = req.body.mid;

    firebase.database().ref("users").orderByChild('mid').equalTo(mid).on("value", function(snapshot) {
        //console.log(snapshot.val());
        result=[];
        snapshot.forEach(function(data) {
            result.push(data.val());
            //console.log(data.key);
        });
        res.json(result);
    });
})




module.exports = {router: router}