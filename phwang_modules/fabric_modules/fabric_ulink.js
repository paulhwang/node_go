/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_ulink.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new FabricUlinkClass(root_object_val);
    },
};

function FabricUlinkClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricUlinkClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.clusterRootObject = function () {
        return this.rootObject().clusterRootObject();
    };

    this.clusterBaseObject = function () {
        return this.rootObject().clusterBaseObject();
    };

    this.mallocCluster = function (data_val, session_val) {
        return this.clusterRootObject().dlinkObject().mallocCluster(data_val, session_val);
    };

    this.topicMallocBase = function () {
        return require("../cluster_modules/cluster_root.js").malloc_base();
    };

    this.topicReceiveData = function (base_id_val, data_val) {
        require("../cluster_modules/cluster_root.js").receive_data(base_id_val, data_val);
    };

    this.topicTransmitData = function (base_id_val) {
        return require("../cluster_modules/cluster_root.js").transmit_data(base_id_val);
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

