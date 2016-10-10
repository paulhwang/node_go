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
    this.theUtilModule = require("./../util_modules/util_module.js");

    this.theFibreObject = fibre_val;

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(my_name_val, link_id_val);
    };

    this.queueModule = function () {
        return this.rootObject().queueModule();
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

    this.abend = function (str1_val, str2_val) {
        this.utilModule().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };
}
