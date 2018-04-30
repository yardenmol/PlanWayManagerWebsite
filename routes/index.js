var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendfile(path.join(__dirname,'../client/dist/index.html'));
});

module.exports = router;
