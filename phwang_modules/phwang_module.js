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
    this.theQueueModule = require("./util_modules/queue_module.js");

    this.mallocModules = function () {
        var util_module = require("./util_modules/util_module.js");
        var fabric_module = require("./fabric_modules/fabric_module.js");
        var port_module = require("./port_modules/port_module.js");

        this.theUtilObject = util_module.malloc(this);
        this.theFarbricObject = fabric_module.malloc(this);
        this.thePortObject = port_module.malloc(this);
    };

    this.objectName = function () {
        return "RootObject";
    };

    this.utilObject = function () {
        return this.theUtilObject;
    };

    this.queueModule = function () {
        return this.theQueueModule;
    };

    this.farbricObject = function () {
        return this.theFarbricObject;
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
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.mallocModules();
}