/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_cluster_module.js
 */

module.exports = {
    malloc: function (cluster_mgr_val) {
        return new clusterObject(cluster_mgr_val);
    },
};

function clusterObject (cluster_mgr_val) {
    "use strict";
    this.theUtilModule = require("./../util_modules/util_module.js");
    this.theQueueModule = require("./../util_modules/queue_module.js");
    this.theGoContainerModule = require("./../go_modules/go_module.js")

    this.theClusterMgrObject = cluster_mgr_val;

    this.objectName = function () {
        return "clusterObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.queueModule = function () {
        return this.theQueueModule;
    };

    this.goContainerModule = function () {
        return this.theGoContainerModule;
    };

    this.sessionObject = function () {
        return this.sessionArray(0);
    };

    this.goContainerObject = function () {
        return this.theGoContainerObject;
    };

    this.clusterMgrObject = function () {
        return this.theClusterMgrObject;
    };

    this.FibreObject = function () {
        return this.clusterMgrObject().FibreObject();
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

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.addAdditionalSession = function (session_val) {
        this.theSessionArray[this.sessionArrayLength()] = session_val;
        this.incrementSessionArrayLength();
    };

    this.enqueueTransmitData = function (data_val) {
        this.debug(true, "enqueueTransmitData", data_val);
        this.transmitQueue().enQueue(data_val);
    };

    this.dequeueTransmitData = function () {
        var data = this.transmitQueue().deQueue();
        this.debug(true, "dequeueTransmitData", data);
        return data;
    };

    this.enqueueReceiveData = function (data_val) {
        this.debug(true, "enqueueReceiveData", data_val);
        this.receiveQueue().enQueue(data_val);
    };

    this.dequeueReceiveData = function () {
        var data = this.receiveQueue().deQueue();
        this.debug(true, "dequeueReceiveData", data);
        return data;
    };

    this.processTransmitData = function () {
        while (true) {
            var data = this.dequeueTransmitData();
            if (!data) {
                return;
            }

            var i = 0;
            while (i < this.sessionArrayLength()) {
                this.sessionArray(i).enqueueTransmitData(data);
                i += 1;
            }
        }
    };

    this.processSetupLinkData = function (json_data_val) {
        this.debug(true, "processSetupLinkData", "data=" + json_data_val);
        var json = JSON.parse(json_data_val);
        if (json.command === "config") {
            this.goContainerObject().configObject().createConfig(json.data);
        }
    };

    this.processReceiveData = function () {
        while (true) {
            var data = this.dequeueReceiveData();
            if (!data) {
                return;
            }
            this.receiveStringData(data);
        }
    };

    this.enqueAndPocessReceiveData = function (data_val) {
        this.debug(true, "enqueAndPocessReceiveData", data_val);
        this.enqueueReceiveData(data_val);
        this.processReceiveData();
    };

    this.receiveStringData = function (str_val) {
        this.goContainerObject().portObject().receiveStringData(str_val);
    };

    this.logit(this.objectName(), "aaa");

    this.theSessionArray = [2];
    this.theSessionArrayLength = 0;
    this.theGoContainerObject = this.goContainerModule().malloc(this);
    this.theReceiveQueue = this.queueModule().malloc();
    this.theTransmitQueue = this.queueModule().malloc();
    this.theNext = null;
}
