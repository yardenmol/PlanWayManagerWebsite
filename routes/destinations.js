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
            let temp_j = data.val();
            temp_j.uid = data.key;
            result.push(temp_j);
            // console.log(temp_j);
            // console.log(data.key);
        });
        // console.log(result);
        res.json(result);
     });
})


router.post('/delete-destination',function (req,res,next) {
    var uid = req.body.uid;
    firebase.database().ref('destinations/'+uid).remove(error => {
        if(error==null)
            res.json({ success: true, message: "destination deleted successfully"});
        else
            res.json({ success: false, message: error.message });
    })
})


router.post('/edit-destinations',function (req,res,next) {
    firebase.database().ref('destinations/'+req.body.uid).update({
        name: req.body.name,
    },error => {
        if(error==null)
            res.json({ success: true, message: "destinations deleted successfully"});
        else
            res.json({ success: false, message: error.message });
    })
})

module.exports = {router: router};