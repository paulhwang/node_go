/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_dlink.js
 */

var the_go_base_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_go_base_mgr_object) {
            the_go_base_mgr_object = new GoBaseMgrClass(root_object_val);
        }
        return the_go_base_mgr_object;
    },

    malloc_base: function () {
        return the_go_base_mgr_object.mallocBase();
    },

    receive_data: function (base_id_val, data_val) {
        the_go_base_mgr_object.receiveData(base_id_val, data_val);
    },

    transmit_data: function (base_id_val) {
        return the_go_base_mgr_object.transmitData(base_id_val);
    },
};

function GoBaseMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theBaseListObject = this.importObject().importListMgr().malloc_mgr(this, 2000);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoBaseMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.baseListObject = function () {
        return this.theBaseListObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.mallocBase = function () {
        var base = this.importObject().importBase().malloc(this.rootObject(), this.baseListObject().allocId());
        this.baseListObject().enQueue(base);
        return base.baseId();
    };

    this.receiveData = function (base_id_val, data_val) {
        this.debug(false, "receiveData", "data=" + data_val);
        var base = this.baseListObject().searchId(base_id_val);
        if (!base) {
            return;
        }
        base.portObject().receiveStringData(data_val);
    };

    this.transmitData = function (base_id_val) {
        var base = this.baseListObject().searchId(base_id_val);
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
        this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(root_object_val);
}

