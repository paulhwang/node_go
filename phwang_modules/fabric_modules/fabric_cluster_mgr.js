/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_cluster_mgr.js
 */

var the_fabric_cluster_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        the_fabric_cluster_mgr_object = new FabricClusterMgrClass(root_object_val);
        return the_fabric_cluster_mgr_object;
    },

    receive_data: function (cluster_object_val, data_val) {
        the_fabric_cluster_mgr_object.receiveData(cluster_object_val, data_val);
    },
};

function FabricClusterMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theClusterListObject = this.importObject().importListMgr().malloc_mgr(this, 100);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricClusterMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.clusterListObject = function () {
        return this.theClusterListObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.mallocCluster = function (data_val, session_val) {
        var cluster = require("./fabric_cluster.js").malloc(this.rootObject(), data_val, session_val);
        this.clusterListObject().insertEntry(cluster);
        cluster.setGroupObject(require("../matrix_modules/matrix_group_mgr.js").malloc_group(data_val, cluster));
        return cluster;
    };

    this.receiveData = function (cluster_object_val, data_val) {
        cluster_object_val.receiveData(data_val);
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

