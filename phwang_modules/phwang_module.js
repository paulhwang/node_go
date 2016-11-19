/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

module.exports = {
    malloc: function () {
        return new RootObject();
    },
};

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