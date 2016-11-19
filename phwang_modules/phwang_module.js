/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

module.exports = {
    get_root: function () {
        return the_root;
    },

    LOG_IT: function (str1_val, str2_val) {
        the_root.LOG_IT(str1_val, str2_val);
    },

    ABEND: function (str1_val, str2_val) {
        the_root.LOG_IT(str1_val, str2_val);
    },
};

var the_root = new RootObject();

function RootObject () {
    "use strict";

    this.init__ = function () {
        this.theUtilObject = require("./util_modules/util_module.js").malloc(this);
        this.theFabricObject = require("./fabric_modules/fabric_module.js").malloc(this);
        this.thePortObject = require("./port_modules/port_module.js").malloc(this);
    };

    this.objectName = function () {
        return "RootObject";
    };

    this.queueModule = function () {
        return require("./util_modules/queue_module.js");
    };

    this.utilObject = function () {
        return this.theUtilObject;
    };

    this.fabricObject = function () {
        return this.theFabricObject;
    };

    this.portObject = function () {
        return this.thePortObject;
    };

    this.linkMgrObject = function () {
        return this.farbricObject().linkMgrObject();
    };

    this.sessionMgrObject = function () {
        return this.farbricObject().sessionMgrObject();
    };

    this.clusterMgrObject = function () {
        return this.farbricObject().clusterMgrObject();
    };

    this.mallocQueue = function () {
        return require("./util_modules/queue_module.js").malloc(this);
    };

    this.mallocRing = function () {
        return require("./util_modules/ring_module.js").malloc(this);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        if (str1_val === undefined) {
            str1_val = "UNDEFINED";
        }
        if (str1_val === null) {
            str1_val = "NULL";
        }
        if (str2_val === undefined) {
            str2_val = "UNDEFINED";
        }
        if (str2_val === null) {
            str2_val = "NULL";
        }
        console.log(str1_val + "() " + str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        if (str1_val === undefined) {
            str1_val = "UNDEFINED";
        }
        if (str1_val === null) {
            str1_val = "NULL";
        }
        if (str2_val === undefined) {
            str2_val = "UNDEFINED";
        }
        if (str2_val === null) {
            str2_val = "NULL";
        }
        console.log("***ABEND*** " + str1_val + "() " + str2_val);
        this.doCrash();
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        require("../util_modules/util_module.js").LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        require("../util_modules/util_module.js").ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__();
}
