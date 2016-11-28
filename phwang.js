var express = require('express');
var bodyParser = require('body-parser');
var matrix_root = require('./phwang_modules/matrix_modules/matrix_root.js');
var fabric_root = require('./phwang_modules/fabric_modules/fabric_root.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../js_go"));
app.post("/django_go/go_ajax/", fabric_root.post);
app.get("/django_go/go_ajax/", fabric_root.get);
app.use(fabric_root.not_found);
app.use(fabric_root.failure);
app.listen(8080);
