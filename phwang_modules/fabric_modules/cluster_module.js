/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_cluster_module.js
 */

module.exports = {
    malloc: function (cluster_mgr_val, topic_data_val, session_val) {
        return new clusterObject(cluster_mgr_val, topic_data_val, session_val);
    },
};

function clusterObject (cluster_mgr_val, topic_data_val, session_val) {
    "use strict";

    this.init__ = function (cluster_mgr_val, topic_data_val, session_val) {
        this.theClusterMgrObject = cluster_mgr_val;
        session_val.setClusterObject(this);
        this.theSessionArray = [2];
        this.theSessionArray[0] = session_val;
        this.theSessionArrayLength = 1;
        this.theReceiveQueue = this.rootObject().mallocQueue();
        this.theTransmitQueue = this.rootObject().mallocQueue();
        this.theNext = null;
        this.thePrev = null;
        this.createTopic(topic_data_val);
        this.debug(true, "init__", "");
    };

    this.goObjectMalloc = function () {
        var go_module = require("./../go_modules/go_module.js")
        return go_module.malloc(this);
    },

    this.objectName = function () {
        return "clusterObject";
    };

    this.sessionObject = function () {
        return this.sessionArray(0);
    };

    this.clusterMgrObject = function () {
        return this.theClusterMgrObject;
    };

    this.rootObject = function () {
        return this.clusterMgrObject().rootObject();
    };

    this.fabricObject = function () {
        return this.clusterMgrObject().fabricObject();
    };

    this.utilObject = function () {
        return this.clusterMgrObject().utilObject();
    };

    this.topicObject = function () {
        return this.theTopicObject;
    };

    this.setTopicObject = function (val) {
        this.theTopicObject = val;
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

    this.prev = function () {
        return this.thePrev;
    };

    this.setPrev = function (val) {
        this.thePrev = val;
    };

    this.next = function () {
        return this.theNext;
    };

    this.setNext = function (val) {
        this.theNext = val;
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.createTopic = function (topic_data_val) {
        var topic_data = JSON.parse(topic_data_val);
        if (topic_data.title === "go") {
            this.setTopicObject(this.goObjectMalloc());
        }
    };

    this.addAdditionalSession = function (session_val) {
        this.theSessionArray[this.sessionArrayLength()] = session_val;
        this.incrementSessionArrayLength();
    };

    this.enqueueTransmitData = function (data_val) {
        this.debug(false, "enqueueTransmitData", data_val);
        this.transmitQueue().enQueue(data_val);
    };

    this.dequeueTransmitData = function () {
        var data = this.transmitQueue().deQueue();
        this.debug(false, "dequeueTransmitData", data);
        return data;
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
            this.topicObject().configObject().createConfig(topic_data.data);
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
        this.debug(false, "enqueAndPocessReceiveData", data_val);
        this.enqueueReceiveData(data_val);
        this.processReceiveData();
    };

    this.receiveStringData = function (str_val) {
        this.topicObject().portObject().receiveStringData(str_val);
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

    this.init__(cluster_mgr_val, topic_data_val, session_val);
}
