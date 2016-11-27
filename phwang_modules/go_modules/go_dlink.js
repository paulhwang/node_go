/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_dlink.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new GoDlinkClass(root_object_val);
    },
};

function GoDlinkClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoDlinkClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.baseMgrObject = function () {
        return this.rootObject().baseMgrObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.mallocBase = function () {
        var base = this.importObject().importBase().malloc(this.rootObject(), this.baseMgrObject().allocId());
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
        this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(root_object_val);
}

