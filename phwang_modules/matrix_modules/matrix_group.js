/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_group.js
 */

module.exports = {
    malloc: function (root_object_val, topic_data_val, session_val) {
        return new MatrixGroupObject(root_object_val, topic_data_val, session_val);
    },
};

function MatrixGroupObject (root_object_val, topic_data_val, session_val) {
    "use strict";

    this.init__ = function (root_object_val, topic_data_val, session_val) {
        this.theRootObject = root_object_val;
        this.theJointObject = this.rootObject().importObject().importListMgr().malloc_joint(999);
        //session_val.setClusterObject(this);
        this.theSessionArray = [2];
        this.theSessionArray[0] = session_val;
        this.theSessionArrayLength = 1;
        this.theReceiveQueue = this.rootObject().importObject().mallocQueue();
        this.theTransmitQueue = this.rootObject().importObject().mallocQueue();
        this.theNext = null;
        this.thePrev = null;
        this.theTopicBaseId = 0;
        this.createTopic(topic_data_val);
        this.debug(false, "init__", "topic base_id=" + this.topicBaseId());
    };

    this.goObjectMalloc = function () {
        var go_module = require("./../go_modules/go_base.js")
        return go_module.malloc(this);
    },

    this.objectName = function () {
        return "MatrixGroupObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.jointObject = function () {
        return this.theJointObject;
    };

    this.topicMgrObject = function () {
        return this.rootObject().topicMgrObject();
    };

    this.sessionObject = function () {
        return this.sessionArray(0);
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
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

    this.topicBaseId = function () {
        return this.theTopicBaseId;
    };

    this.setTopicBaseId = function (val) {
        this.theTopicBaseId = val;
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
            this.setTopicBaseId(this.topicMgrObject().topicMallocBase());
            this.debug(false, "createTopic", "base_id=" + this.topicBaseId());
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
            this.receiveData(data);
        }
    };

    this.enqueAndPocessReceiveData = function (data_val) {
        this.debug(false, "enqueAndPocessReceiveData", data_val);
        this.enqueueReceiveData(data_val);
        this.processReceiveData();
    };

    this.receiveData = function (data_val) {
        this.topicMgrObject().topicReceiveData(this.topicBaseId(), data_val);
        var data = this.topicMgrObject().topicTransmitData(this.topicBaseId());
        this.debug(false, "receiveData", "data=" + data);
        var i = 0;
        while (i < this.sessionArrayLength()) {
            this.sessionArray(i).enqueueTransmitData(data);
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
