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
    this.theClusterMgrObject = cluster_mgr_val;

    this.goObjectMalloc = function (cluster_val) {
        var go_module = require("./../go_modules/go_module.js")
        return go_module.malloc(cluster_val);
    },

    this.objectName = function () {
        return "clusterObject";
    };

    this.sessionObject = function () {
        return this.sessionArray(0);
    };

    this.goObject = function () {
        return this.theGoObject;
    };

    this.clusterMgrObject = function () {
        return this.theClusterMgrObject;
    };

    this.fibreObject = function () {
        return this.clusterMgrObject().fibreObject();
    };

    this.utilObject = function () {
        return this.clusterMgrObject().utilObject();
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

    this.processSetupTopicData = function (json_data_val) {
        this.debug(true, "processSetupTopicData", "data=" + json_data_val);
        var topic_data = JSON.parse(json_data_val);
        if (topic_data.command === "config") {
            this.goObject().configObject().createConfig(topic_data.data);
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
        this.goObject().portObject().receiveStringData(str_val);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.clusterMgrObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.clusterMgrObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theSessionArray = [2];
    this.theSessionArrayLength = 0;
    this.theGoObject = this.goObjectMalloc(this);
    this.theReceiveQueue = this.utilObject().mallocQueue();
    this.theTransmitQueue = this.utilObject().mallocQueue();
    this.theNext = null;
}
