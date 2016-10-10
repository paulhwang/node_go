/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: cluster_mgr_module.js
 */

module.exports = {
    malloc: function (fibre_val) {
        return new clusterMgrObject(fibre_val);
    },
};

function clusterMgrObject(fibre_val) {
    "use strict";
    this.theFibreObject = fibre_val;

    this.clusterModuleMalloc = function () {
        var cluster_module = require("./cluster_module.js");
        return cluster_module.malloc(this);
    };

    this.objectName = function () {
        return "clusterMgrObject";
    };

    this.fibreObject = function () {
        return this.theFibreObject;
    };

    this.rootObject = function () {
        return this.fibreObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.clusterQueue = function () {
        return this.theClusterQueue;
    };

    this.poolQueue = function () {
        return this.thePoolQueue;
    };

    this.globalClusterId = function () {
        return this.theGlobalClusterId;
    };

    this.incrementGlobalClusterId = function () {
        return this.theGlobalClusterId += 1;
    };

    this.mallocCluster = function (my_name_val) {
        var entry = this.poolQueue().deQueue();
        if (!entry) {
            entry = this.clusterModuleMalloc();
        } else {
            entry.resetIt();
        }
        this.incrementGlobalClusterId();
        return entry;
    };

    this.freeCluster = function (cluster_val) {
        this.poolQueue().enQueue(cluster_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };
 
    this.theGlobalClusterId = 100;
    this.theClusterQueue = this.utilObject().queueModule().malloc();
    this.thePoolQueue = this.utilObject().queueModule().malloc();
}
