/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: logit_module.js
 */

module.exports = {
    malloc: function () {
        return new RootObject();
    },
    get_root: function () {
        return the_root;
    },
};

var the_root = new RootObject();

function RootObject () {
    "use strict";

    this.init__ = function () {
        this.theLinkMgrObject = require("./link_mgr_module.js").malloc(this);
        this.theClusterMgrObject = require("./cluster_mgr_module.js").malloc(this);
        this.theSwitchObject = require("./switch_module.js").malloc(this);
        this.theAjaxObject = require("./ajax_module.js").malloc(this);
        //this.theExpressHttpObject = require("./http_module.js").malloc(this);
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

    this.expressHttpObject = function () {
        return this.theExpressHttpObject;
    };

    this.mallocQueue = function () {
        return require("../util_modules/queue_module.js").malloc(this);
    };

    this.mallocRing = function () {
        return require("../util_modules/ring_module.js").malloc(this);
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
        require("../util_modules/logit_module.js").LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        require("../util_modules/logit_module.js").ABEND(str1_val, str2_val);
    };

    this.init__();
};
