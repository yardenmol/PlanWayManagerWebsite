var express = require('express');
var router = express.Router();
var twitter = require ('twitter');

var client = new twitter({
    consumer_key:'IPnGpTR2JNqdjC4KRreXOuzgm',
    consumer_secret:'g4QZWoD9RcY6Y5vDxTAQatyTtUZYmOCWr9OKXcrcJ92mIP950Z',
    access_token_key:'961508025436659717-Fsn5SR2zJQjSAkx3cc1xVehNwDJAEYQ',
    access_token_secret:'jSJiiIyJfwA1yx70ym6OFeAHMB3j87MvBgQaUhsksHwX4'
});


// post tweet
router.post('/tweet', function(req, res, next) {
    client.post('statuses/update', {status: req.body.text},  function(error, tweet, response) {
        if(error)
            res.json({result:true});
        else
            res.json({result: false});

    });
});

module.exports = router;
