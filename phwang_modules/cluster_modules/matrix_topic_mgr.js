/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: cluster_ulink.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new ClusterUlinkClass(root_object_val);
    },
};

function ClusterUlinkClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "ClusterUlinkClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
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
        this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(root_object_val);
}

