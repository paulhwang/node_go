/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: express_http_module.js
 */

//var util = require("./util_module.js");
var queue = require("./phwang_modules/util_modules/queue_module.js");
var link_entry = require("./phwang_modules/fabric_modules/link_module.js");
var express = require('express');
var bodyParser = require('body-parser');
var state;

var theExpressHttpObject = new ExpressHttpObject(require("./phwang_modules/fabric_modules/root_module.js").get_root());

module.exports = {
    post: function (req, res) {
        theExpressHttpObject.processPost(req, res);
    },
    
    get: function (req, res) {
        theExpressHttpObject.processGet(req, res);
    },

    not_found: function (req, res) {
        theExpressHttpObject.processNotFound(req, res);
    },
    
    failure: function (req, res) {
        theExpressHttpObject.processFailure(err, req, res, next);
    },
};

function ExpressHttpObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "ExpressHttpObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.portObject = function () {
        return this.rootObject().portObject();
    };

    this.ajaxObject = function () {
        return this.rootObject().ajaxObject();
    };

    this.linkMgrObject = function () {
        return this.rootObject().linkMgrObject();
    };

    this.sessionMgrObject = function () {
        return this.rootObject().sessionMgrObject();
    };

    this.processGet = function (req, res) {
        this.ajaxObject().processGet(req, res);
    };

    this.processNotFound = function (req, res) {
        console.log(req.headers);
        this.debug(true, "processNotFound", "*****");
        res.type('text/plain');
        res.status(404);
        res.send('Not Found');
    };

    this.processFailure = function (err, req, res, next) {
        this.logit("processFailure", state);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };
}
