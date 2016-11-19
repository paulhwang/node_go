/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: util_module.js
 */

module.exports = {
    malloc: function (root_val) {
        return new UtilObject(root_val);
    },
};

function UtilObject(root_val) {
    "use strict";

    this.init__ = function (root_val) {
        this.theRootObject = root_val;
    };

    this.objectName = function () {
        return "UtilObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.mallocQueue = function () {
        return require("./queue_module.js").malloc(this);
    };

    this.mallocRing = function () {
        return require("./ring_module.js").malloc(this);
    };

    this.init__(root_val);
}
