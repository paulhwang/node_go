/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: util_module.js
 */

module.exports = {
    malloc: function (root_val) {
        return new UtilObject(root_val);
    },

    LOG_IT: function (str1_val, str2_val) {
        LOG_IT(str1_val, str2_val);
    },

    ABEND: function (str1_val, str2_val) {
        LOG_IT(str1_val, str2_val);
    },
};

var LOG_IT = function(str1_val, str2_val) {
    if (str1_val === undefined) {
        str1_val = "UNDEFINED";
    }
    if (str1_val === null) {
        str1_val = "NULL";
    }
    if (str2_val === undefined) {
        str2_val = "UNDEFINED";
    }
    if (str2_val === null) {
        str2_val = "NULL";
    }
    console.log(str1_val + "() " + str2_val);
};

var ABEND = function(str1_val, str2_val) {
    if (str1_val === undefined) {
        str1_val = "UNDEFINED";
    }
    if (str1_val === null) {
        str1_val = "NULL";
    }
    if (str2_val === undefined) {
        str2_val = "UNDEFINED";
    }
    if (str2_val === null) {
        str2_val = "NULL";
    }
    console.log("***ABEND*** " + str1_val + "() " + str2_val);
    this.doCrash();
};

var theUtilObject = new UtilObject();

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
