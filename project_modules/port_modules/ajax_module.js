/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fibre_module.js
 */

module.exports = {
    malloc: function (port_object_val) {
        return new AjaxObject(port_object_val);
    },
};

function AjaxObject(port_object_val) {
    "use strict";
    this.thePortObject = port_object_val;

    this.objectName = function () {
        return "AjaxObject";
    };

    this.portObject = function () {
        return this.thePortObject;
    };

    this.utilObject = function () {
        return this.utilObject().utilObject();
    };
}
