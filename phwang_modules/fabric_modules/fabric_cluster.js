/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_cluster.js
 */

module.exports = {
    malloc: function (root_object_val, topic_data_val, session_val) {
        return new FabricClusterClass(root_object_val, topic_data_val, session_val);
    },
};

function FabricClusterClass(root_object_val, topic_data_val, session_val) {
    "use strict";

    this.init__ = function (root_object_val, topic_data_val, session_val) {
        this.theRootObject  = root_object_val;
        session_val.setClusterObject(this);
        this.theSessionArray = [2];
        this.theSessionArray[0] = session_val;
        this.theSessionArrayLength = 1;
        this.theJointObject = this.importListMgr().malloc_joint(0, "tbd");
        this.theTransmitQueue = this.rootObject().importObject().mallocQueue();
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricClusterClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.jointObject = function () {
        return this.theJointObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.groupObject = function () {
        return this.theGroupObject;
    };

    this.setGroupObject = function (val) {
        this.theGroupObject = val;
    };


    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.sessionArray = function (index_val) {
        return this.theSessionArray[index_val];
    };

    this.sessionArrayLength = function () {
        return this.theSessionArrayLength;
    };

    this.incrementSessionArrayLength = function () {
        this.theSessionArrayLength += 1;
    };

    this.addAdditionalSession = function (session_val) {
        this.theSessionArray[this.sessionArrayLength()] = session_val;
        this.incrementSessionArrayLength();
    };


    this.TransmitData = function (data_val) {
        this.debug(false, "TransmitData", data_val);
        this.transmitQueue().enQueue(data_val);
        while (true) {
            var data = this.transmitQueue().deQueue();
            if (!data) {
                return;
            }
            require("../matrix_modules/matrix_group_mgr.js").receive_data(this.groupObject(), data);
        }
    };

    this.receiveData = function (data_val) {
        this.debug(false, "receiveData", "data_val=" + data_val);
        var i = 0;
        while (i < this.sessionArrayLength()) {
            this.sessionArray(i).enqueueTransmitData(data_val);
            i += 1;
        }
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

    this.init__(root_object_val, topic_data_val, session_val);
}
