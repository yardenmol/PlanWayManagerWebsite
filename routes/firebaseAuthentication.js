var express = require('express');
var router = express.Router();
const firebase = require('firebase');

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


module.exports = {router: router};