var express = require('express');
var bodyParser = require('body-parser');
var express_http = require('./express_http_module.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../js_go"));
app.post("/django_go/go_ajax/", express_http.post);
app.get("/django_go/go_ajax/", express_http.get);
app.use(express_http.not_found);
app.use(express_http.failure);
app.listen(8080);
