var express = require('express');
var bodyParser = require('body-parser');
require('./phwang_modules/go_modules/go_root.js');
require('./phwang_modules/matrix_modules/matrix_root.js');
require('./phwang_modules/fabric_modules/fabric_root.js');
var ajax = require('./phwang_modules/fabric_modules/fabric_ajax.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../js_go"));
app.post("/django_go/go_ajax/", ajax.post);
app.get("/django_go/go_ajax/", ajax.get);
app.use(ajax.not_found);
app.use(ajax.failure);
app.listen(8080);
