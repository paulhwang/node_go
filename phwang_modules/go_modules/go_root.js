/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_root.js
 */

var the_go_root_object = new GoRootClass();

module.exports = {
    malloc_base: function () {
        return the_go_root_object.baseMgrObject().mallocBase();
    },

    receive_data: function (base_id_val, data_val) {
        the_go_root_object.baseMgrObject().receiveData(base_id_val, data_val);
    },

    transmit_data: function (base_id_val) {
        return the_go_root_object.baseMgrObject().transmitData(base_id_val);
    },
};

function GoRootClass () {
    "use strict";

    this.init__ = function () {
        this.theImportObject = require("./go_import.js").malloc(this);
        this.theBaseMgrObject = this.importObject().importBaseMgr().malloc(this);
        this.theBaseListObject = this.importObject().importListMgr().malloc_mgr(this, 100);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoRootClass";
    };

    this.importObject = function () {
        return this.theImportObject;
    };

    this.baseMgrObject = function () {
        return this.theBaseMgrObject;
    };

    this.baseListObject = function () {
        return this.theBaseListObject;
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
