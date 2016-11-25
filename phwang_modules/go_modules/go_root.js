/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_root.js
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
        this.theImportObject = require("./go_import.js").malloc(this);
        this.theBaseMgrObject = this.importObject().importListMgr().malloc_mgr(100);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoRootObject";
    };

    this.importObject = function () {
        return this.theImportObject;
    };

    this.baseMgrObject = function () {
        return this.theBaseMgrObject;
    };

    this.mallocBase = function () {
        var base = this.importObject().importBase().malloc(this, this.baseMgrObject().allocId());
        this.baseMgrObject().insertEntry(base);
        this.debug(false, "mallocBase", "baseId=" + base.baseId());
        return base.baseId();
    };

    this.receiveData = function (base_id_val, data_val) {
        this.debug(false, "receiveData", "data=" + data_val);
        var base = this.baseMgrObject().searchId(base_id_val);
        if (!base) {
            return;
        }
        base.portObject().receiveStringData(data_val);
    };

    this.transmitData = function (base_id_val) {
        var base = this.baseMgrObject().searchId(base_id_val);
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
        this.importObject().importLogit().LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
         this.importObject().importLogit().ABEND(str1_val, str2_val);
    };

    this.init__();
};
