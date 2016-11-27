/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: root_module.js
 */

var the_cluster_root_object = new ClusterRootClass();

module.exports = {
    malloc: function (root_object_val) {
        the_cluster_root_object.setRootObject(root_object_val);
        return the_cluster_root_object;
    },

    malloc_base: function () {
        return the_cluster_root_object.mallocBase();
    },

    receive_data: function (base_id_val, data_val) {
        the_cluster_root_object.receiveData(base_id_val, data_val);
    },

    transmit_data: function (base_id_val) {
        return the_cluster_root_object.transmitData(base_id_val);
    },
};

function ClusterRootClass () {
    "use strict";

    this.init__ = function () {
        this.theImportObject = require("./cluster_import.js").malloc(this);
        this.theClusterBaseObject = this.importObject().importClusterBase().malloc(this);
        this.theClusterMgrObject = this.importObject().importListMgr().malloc_mgr(this, 0);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "ClusterRootClass";
    };

    this.setRootObject = function (val) {
        return this.theRootObject = val;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importObject = function () {
        return this.theImportObject;
    };

    this.baseObject = function () {
        return this.theBaseObject;
    };

    this.clusterBaseObject = function () {
        return this.theClusterBaseObject;
    };

    this.clusterMgrObject = function () {
        return this.theClusterMgrObject;
    };

    this.topicMallocBase = function () {
        return require("../go_modules/go_root.js").malloc_base();
    };

    this.topicReceiveData = function (base_id_val, data_val) {
        require("../go_modules/go_root.js").receive_data(base_id_val, data_val);
    };

    this.topicTransmitData = function (base_id_val) {
        return require("../go_modules/go_root.js").transmit_data(base_id_val);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        this.importObject().importLogit().LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        this.importObject().importLogit().ABEND(str1_val, str2_val);
    };

    this.init__();
};