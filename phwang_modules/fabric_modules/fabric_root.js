/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: root_module.js
 */
var the_root_object = new FabricRootClass();

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

function FabricRootClass () {
    "use strict";

    this.init__ = function () {
        this.theImportObject = require("./fabric_import.js").malloc(this);
        this.theUlinkObject = this.importObject().importUlink().malloc(this);
        this.theDlinkObject = this.importObject().importDlink().malloc(this);
        this.theBaseObject = this.importObject().importBase().malloc(this);
        this.theLinkListObject = this.importObject().importListMgr().malloc_mgr(this, 0);
        this.theClusterListObject = this.importObject().importListMgr().malloc_mgr(this, 0);
        this.theSwitchObject = this.importObject().importSwitch().malloc(this);
        this.theAjaxObject = this.importObject().importAjax().malloc(this);
        this.theClusterRootObject = require("../cluster_modules/cluster_root.js").malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricRootClass";
    };

    this.importObject = function () {
        return this.theImportObject;
    };

    this.ulinkObject = function () {
        return this.theUlinkObject;
    };

    this.dlinkObject = function () {
        return this.theDlinkObject;
    };

    this.baseObject = function () {
        return this.theBaseObject;
    };

    this.linkListObject = function () {
        return this.theLinkListObject;
    };

    this.ClusterListObject = function () {
        return this.theClusterListObject;
    };

    this.clusterRootObject = function () {
        return this.theClusterRootObject;
    };

    this.clusterBaseObject = function () {
        return this.clusterRootObject().clusterBaseObject();
    };

    this.clusterMgrObject = function () {
        return this.clusterRootObject().clusterMgrObject();
    };

    this.switchObject = function () {
        return this.theSwitchObject;
    };

    this.ajaxObject = function () {
        return this.theAjaxObject;
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
        this.importObject().importLogit().LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        this.importObject().importLogit().ABEND(str1_val, str2_val);
    };

    this.init__();
};
