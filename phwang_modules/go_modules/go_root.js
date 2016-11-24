/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: root_module.js
 */

var the_go_root_object = new GoRootObject();

module.exports = {
    malloc_base: function () {
        return the_go_root_object.mallocBase();
    },

    receive_data: function (base_id_val, data_val) {
        the_go_root_object.receiveData(base_id_val, data_val);
    },

    transmit_data: function (base_id_val) {
        return the_go_root_object.transmitData(base_id_val);
    },
};

function GoRootObject () {
    "use strict";

    this.init__ = function () {
        this.theBaseMgrObject = require("./go_base_mgr.js").malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoRootObject";
    };

    this.baseMgrObject = function () {
        return this.theBaseMgrObject;
    };

    this.mallocQueue = function () {
        return require("../util_modules/queue.js").malloc(this);
    };

    this.mallocRing = function () {
        return require("../util_modules/ring.js").malloc(this);
    };

    this.mallocBase = function () {
        return this.baseMgrObject().mallocBase(this);
    };

    this.receiveData = function (base_id_val, data_val) {
        this.baseMgrObject().receiveData(base_id_val, data_val);
    };

    this.transmitData = function (base_id_val) {
        return this.baseMgrObject().transmitData(base_id_val);
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
