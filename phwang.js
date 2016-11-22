var express = require('express');
var bodyParser = require('body-parser');
var root = require('./phwang_modules/fabric_modules/root_module.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../js_go"));
app.post("/django_go/go_ajax/", root.post);
app.get("/django_go/go_ajax/", root.get);
app.use(root.not_found);
app.use(root.failure);
app.listen(8080);
