/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_cluster.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new FabricClusterClass(root_object_val);
    },
};

function FabricClusterClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject  = root_object_val;
        this.theJointObject = this.importListMgr().malloc_joint(0, "tbd");
        this.theReceiveQueue = this.rootObject().importObject().mallocQueue();
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricClusterClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.jointObject = function () {
        return this.theJointObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.groupObject = function () {
        return this.theGroupObject;
    };

    this.setGroupObject = function (val) {
        this.theGroupObject = val;
    };


    this.importListMgr = function () {
        return this.importObject().importListMgr();
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
