/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_base.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new FabricBaseClass(root_object_val);
    },
};

function FabricBaseClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "FabricBaseClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkMgrObject = function () {
        return this.rootObject().linkListObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
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
