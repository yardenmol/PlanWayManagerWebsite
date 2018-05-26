var express = require('express');
var router = express.Router();
const firebase = require('firebase');



router.post('/add-destination',function (req,res,next) {
    // var mid = req.body.mid;
    // console.log(req.body);
    // var uid = firebase.database().ref('destinations');
    firebase.database().ref('destinations').push(req.body);
    res.json({ success: true});
});

router.post('/get-destinations',function (req,res,next) {
    var mid = req.body.mid;
    firebase.database().ref("destinations").orderByChild('mid').equalTo(mid).once("value", function(snapshot) {
        // console.log(snapshot.val());
        result=[];
        snapshot.forEach(function(data) {
            result.push(data.val());
            //console.log(data.key);
        });
        // console.log(result);
        res.json(result);
     });
})




module.exports = {router: router};