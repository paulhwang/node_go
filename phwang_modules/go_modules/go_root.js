/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: root_module.js
 */

var the_go_root_object = new GoRootObject();

module.exports = {
    malloc_base: function () {
        the_go_root_object.mallocBase();
    },
    receive_data: function () {
        the_go_root_object.receiveData();
    },
};

function GoRootObject () {
    "use strict";

    this.init__ = function () {
        this.theGoBaseMgrObject = require("./go_base_mgr.js").malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoRootObject";
    };

    this.goBaseMgrObject = function () {
        return this.theGoBaseMgrObject;
    };

    this.mallocQueue = function () {
        return require("../util_modules/queue.js").malloc(this);
    };

    this.mallocRing = function () {
        return require("../util_modules/ring.js").malloc(this);
    };

    this.mallocBase = function () {
        this.goBaseMgrObject().mallocBase();
    };

    this.receiveData = function () {
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        require("../util_modules/logit.js").LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        require("../util_modules/logit.js").ABEND(str1_val, str2_val);
    };

    this.init__();
};
