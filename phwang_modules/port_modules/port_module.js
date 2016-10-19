/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fibre_module.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new PortObject(root_object_val);
    },
};

function PortObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.mallocModules = function () {
        var ajax_module = require("./ajax_module.js");

        this.theAjaxObject = ajax_module.malloc(this);
    };

    this.objectName = function () {
        return "PortObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.ajaxObject = function () {
        return this.theAjaxObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.mallocModules();
}
