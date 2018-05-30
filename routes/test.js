/**
 * Created by Tomer on 28/05/2018.
 */

var express = require('express');
var router = express.Router();
var request = require('request');


const domain = 'http://193.106.55.167:8889/directions/api/v1.0/cluster';
//
// request.post(
//     domain,
//     { locations: ["Rehovot, Israel", "Ashdod, Israel", "Haifa, Israel", "Netanya, Israel", "Ganei Tikva, Israel", "Herzliya, Israel", "Bat Yam, Israel", "Rishon LeTsiyon, Israel", "Be'er Sheva, Israel", "Shoham, Israel"], driversAmount: 2 },
//     function (error, response, body) {
//
//         console.log(body)
//
//     }
// );

//Custom Header pass
// var headersOpt = {
//     "content-type": "application/json",
// };
//


var myJSONObject = {source:"Rishon Lezion" ,locations: ["Rishon Lezion", "Ashdod", "Ramat Gan", "Bat Yam"], driversAmount: 2 };



var options = {
    uri: domain,
    method: 'POST',
    json:  { "source":myJSONObject.source, "locations": myJSONObject.locations, "driversAmount": myJSONObject.driversAmount.toString()}

};

request(options, function (error, response, body) {
    if (!error) {
        console.log(response.body) // Print the shortened url.
    }
    else console.log(error)
});