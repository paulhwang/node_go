/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: cluster_mgr_module.js
 */

module.exports = {
    malloc: function (fabric_val) {
        return new clusterMgrObject(fabric_val);
    },
};

function clusterMgrObject(fabric_val) {
    "use strict";
    this.theFabricObject = fabric_val;

    this.clusterModuleMalloc = function (topic_val, session_val) {
        var cluster_module = require("./cluster_module.js");
        return cluster_module.malloc(this, topic_val, session_val);
    };

    this.objectName = function () {
        return "clusterMgrObject";
    };

    this.fabricObject = function () {
        return this.theFabricObject;
    };

    this.rootObject = function () {
        return this.fabricObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.clusterQueue = function () {
        return this.theClusterQueue;
    };

    this.globalClusterId = function () {
        return this.theGlobalClusterId;
    };

    this.incrementGlobalClusterId = function () {
        this.theGlobalClusterId += 1;
    };

    this.mallocCluster = function (topic_val, session_val) {
        var entry = this.clusterModuleMalloc(topic_val, session_val);
        this.incrementGlobalClusterId();
        return entry;
    };

    this.freeCluster = function (cluster_val) {
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };
 
    this.theGlobalClusterId = 100;
    this.theClusterQueue = this.utilObject().mallocQueue();
    this.thePoolQueue = this.utilObject().mallocQueue();
}
