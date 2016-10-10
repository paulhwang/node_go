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
    this.theUtilObject = require("./util_modules/util_module.js");
    this.theQueueModule = require("./util_modules/queue_module.js");

    this.mallocModules = function () {
        var fibre_module = require("./fibre_modules/fibre_module.js");
        var link_mgr_module = require("./fibre_modules/link_mgr_module.js");
        var session_mgr_module = require("./fibre_modules/session_mgr_module.js");

        this.theFibreObject = fibre_module.malloc(this);
        this.theLinkMgrObject = link_mgr_module.malloc(this);
        this.theSessionMgrObject = session_mgr_module.malloc(this);
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

    this.fibreObject = function () {
        return this.theFibreObject;
    };

    this.linkMgrObject = function () {
        return this.theLinkMgrObject;
    };

    this.sessionMgrObject = function () {
        return this.theSessionMgrObject;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.mallocModules();
}