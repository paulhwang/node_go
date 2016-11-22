/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: root_module.js
 */

var the_go_root_object = new GoRootObject();

module.exports = {
    receive_data: function () {
        the_go_root_object.receiveData();
    },
};

function GoRootObject () {
    "use strict";

    this.init__ = function () {
        this.theGoMgrObject = require("./go_mgr.js").malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoRootObject";
    };

    this.goMgrObject = function () {
        return this.theGoMgrObject;
    };

    this.mallocQueue = function () {
        return require("../util_modules/queue_module.js").malloc(this);
    };

    this.mallocRing = function () {
        return require("../util_modules/ring_module.js").malloc(this);
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
        require("../util_modules/logit_module.js").LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        require("../util_modules/logit_module.js").ABEND(str1_val, str2_val);
    };

    this.init__();
};
