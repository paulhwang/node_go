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
        this.theBaseMgrObject = require("../util_modules/list_mgr.js").malloc();
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
        var base_id = this.baseMgrObject().allocId();
        var base = require("../go_modules/go_base.js").malloc(this, base_id);
        this.baseMgrObject().insertEntryToList(base);
        this.debug(true, "mallocBase", "base_id=" + base_id);
        return base_id;
    };

    this.receiveData = function (base_id_val, data_val) {
        this.debug(false, "receiveData", "data=" + data_val);
        var base = this.baseMgrObject().searchEntryById(base_id_val);
        if (!base) {
            return;
        }
        base.portObject().receiveStringData(data_val);
    };

    this.transmitData = function (base_id_val) {
        var base = this.baseMgrObject().searchEntryById(base_id_val);
        if (!base) {
            return null;
        }
        return base.portObject().dequeueTransmitData();
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
