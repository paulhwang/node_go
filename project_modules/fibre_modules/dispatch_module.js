/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: dispatch_module.js
 */

module.exports = {
    malloc: function (fibre_val) {
        return new DispatchObject(fibre_val);
    },
};

function DispatchObject(fibre_val) {
    "use strict";
    this.theFibreObject = fibre_val;

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(this, my_name_val, link_id_val);
    };

    this.objectName = function () {
        return "DispatchObject";
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

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };
}
