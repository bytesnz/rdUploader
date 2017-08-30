var express = require('express');
var multer = require('multer');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');
var path = require('path');
var multerStorage = multer.memoryStorage();
var multerUpload = multer({ storage: multerStorage });
app.use('/', express.static('static'));
app.post('/', multerUpload.single('file'), function (req, res, next) {
    console.log('got a file upload', req);
    next();
});
//  `sl-catch ${village} ${date} ${name}.xslx`
