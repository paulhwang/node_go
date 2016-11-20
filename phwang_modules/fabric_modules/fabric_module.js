/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_module.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new FabricObject(root_object_val);
    },
};

function FabricObject(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theLinkMgrObject = require("./link_mgr_module.js").malloc(this.rootObject());
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "FibreObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkMgrObject = function () {
        return this.theLinkMgrObject;
    };

    this.sessionMgrObject = function () {
        return this.theSessionMgrObject;
    };

    this.queueObject = function () {
        return this.utilObject().queueObject();
    };

    this.ringObject = function () {
        return this.utilObject().ringObject();
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(root_object_val);
}
