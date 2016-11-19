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

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theAjaxObject = require("./ajax_module.js").malloc(this);
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
