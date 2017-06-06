/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: net_client.js
 */

module.exports = {
    malloc: function (root_object_val) {
        var net_client = new NetClientClass(root_object_val)
        return net_client;
    },

};

function NetClientClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "NetClientClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
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
};
