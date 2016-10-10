/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fibre_module.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new FibreObject(root_object_val);
    },
};

function FibreObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(my_name_val, link_id_val);
    };

    this.objectName = function () {
        return "FibreObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };
}
