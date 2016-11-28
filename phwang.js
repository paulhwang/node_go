var express = require('express');
var bodyParser = require('body-parser');
var matrix_root = require('./phwang_modules/matrix_modules/matrix_root.js');
var root = require('./phwang_modules/fabric_modules/fabric_root.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../js_go"));
app.post("/django_go/go_ajax/", root.post);
app.get("/django_go/go_ajax/", root.get);
app.use(root.not_found);
app.use(root.failure);
app.listen(8080);
