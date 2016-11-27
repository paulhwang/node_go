/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: cluster_dlink.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new ClusterDlinkClass(root_object_val);
    },
};

function ClusterDlinkClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "ClusterDlinkClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.clusterBaseObject = function () {
        return this.rootObject().clusterBaseObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.mallocCluster = function (data_val, session_val) {
        return this.clusterBaseObject().mallocCluster(data_val, session_val);
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

