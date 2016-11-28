/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: cluster_base.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new clusterBaseClass(root_object_val);
    },
};

function clusterBaseClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theClusterQueue = this.rootObject().importObject().mallocQueue();
        this.thePoolQueue = this.rootObject().importObject().mallocQueue();
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "clusterBaseClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.clusterQueue = function () {
        return this.theClusterQueue;
    };

    this.freeCluster = function (cluster_val) {
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
