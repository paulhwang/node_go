/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: root_module.js
 */
var go_root = require('../go_modules/go_root.js');
var the_root_object = new RootObject();

module.exports = {
    post: function (req, res) {
        the_root_object.processPost(req, res);
    },

    get: function (req, res) {
        the_root_object.processGet(req, res);
    },

    not_found: function (req, res) {
        the_root_object.processNotFound(req, res);
    },
    
    failure: function (req, res) {
        the_root_object.processFailure(err, req, res, next);
    },
};

function RootObject () {
    "use strict";

    this.init__ = function () {
        this.theLinkMgrObject = require("./link_mgr.js").malloc(this);
        this.theClusterMgrObject = require("./cluster_mgr.js").malloc(this);
        this.theSwitchObject = require("./switch.js").malloc(this);
        this.theAjaxObject = require("./ajax.js").malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "RootObject";
    };

    this.linkMgrObject = function () {
        return this.theLinkMgrObject;
    };

    this.clusterMgrObject = function () {
        return this.theClusterMgrObject;
    };

    this.switchObject = function () {
        return this.theSwitchObject;
    };

    this.ajaxObject = function () {
        return this.theAjaxObject;
    };

    this.mallocQueue = function () {
        return require("../util_modules/queue.js").malloc(this);
    };

    this.mallocRing = function () {
        return require("../util_modules/ring.js").malloc(this);
    };

    this.topicMallocBase = function () {
        return require("../go_modules/go_root.js").malloc_base();
    };

    this.topicReceiveData = function (base_id_val, data_val) {
        require("../go_modules/go_root.js").receive_data(base_id_val, data_val);
    };

    this.topicTransmitData = function (base_id_val) {
        return require("../go_modules/go_root.js").transmit_data(base_id_val);
    };

    this.processPost = function (req, res) {
        this.ajaxObject().processPost(req, res);
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
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        require("../util_modules/logit.js").LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        require("../util_modules/logit.js").ABEND(str1_val, str2_val);
    };

    this.init__();
};
