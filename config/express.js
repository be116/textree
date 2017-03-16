var express = require('express');
var db = require('../app/models/database');
var router = require('./router');
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var helmet = require("helmet");
var app = express();
var port = process.env.port || 3000;
app.set('views', path.join(__dirname, '../app/views'));
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(helmet());
app.use('/', router);
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
//# sourceMappingURL=express.js.map