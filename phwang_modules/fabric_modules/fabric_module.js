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
        var link_mgr_module = require("./link_mgr_module.js");
        var cluster_mgr_module = require("./cluster_mgr_module.js");
        var switch_module = require("./switch_module.js");
        this.theLinkMgrObject = link_mgr_module.malloc(this);
        this.theClusterMgrObject = cluster_mgr_module.malloc(this);
        this.theSwitchObject = switch_module.malloc(this);
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

    this.clusterMgrObject = function () {
        return this.theClusterMgrObject;
    };

    this.switchObject = function () {
        return this.theSwitchObject;
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
        require("../util_modules/util_module.js").LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        require("../util_modules/util_module.js").ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(root_object_val);
}
