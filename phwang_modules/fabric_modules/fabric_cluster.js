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
        this.theReceiveQueue = this.rootObject().importObject().mallocQueue();
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

    this.receiveQueue = function () {
        return this.theReceiveQueue;
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

    this.enqueueReceiveData = function (data_val) {
        this.debug(false, "enqueueReceiveData", data_val);
        this.receiveQueue().enQueue(data_val);
    };

    this.dequeueReceiveData = function () {
        var data = this.receiveQueue().deQueue();
        this.debug(false, "dequeueReceiveData", data);
        return data;
    };

    this.processReceiveData = function () {
        while (true) {
            var data = this.dequeueReceiveData();
            if (!data) {
                return;
            }
            this.receiveData(data);
        }
    };

    this.enqueAndPocessReceiveData = function (data_val) {
        this.debug(false, "enqueAndPocessReceiveData", data_val);
        this.enqueueReceiveData(data_val);
        this.processReceiveData();
    };

    this.receiveData = function (data_val) {
        this.groupObject().receiveData(data_val);
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
