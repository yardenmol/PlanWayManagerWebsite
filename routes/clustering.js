/**
 * Created by Tomer on 28/05/2018.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
// var request = require('request');

const domain = "http://193.106.55.167:8889/directions/api/v1.0/cluster";


router.post('/send-cluster',function (req,res,next) {
    // var mid = req.body.mid;
    // console.log(req.body);
    var options = {
        uri: domain,
        method: 'POST',
        json:  {  source:req.body.locations[0], "locations":req.body.locations , "driversAmount": req.body.driversAmount.toString()}

    };
    request(options, function (error, response, body) {
        console.log(response.body);
        if (!error) {
            // console.log(response.body); // Print the shortened url.
            res.json({success: true, data:response.body});
        }
        if(error){
        res.json({ success: false, message: error.message });
        }
    });
});

module.exports = {router: router};




