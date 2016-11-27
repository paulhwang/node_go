/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_ulink.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new GoUlinkClass(root_object_val);
    },
};

function GoUlinkClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoUlinkClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
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

    this.LOG_IT = function (s1_val, s2_val) {
        this.rootObject().LOG_IT(s1_val, s2_val);
    };

    this.ABEND = function (s1_val, s2_val) {
        this.rootObject().ABEND(s1_val, s2_val);
    };

    this.init__(root_object_val);
}

