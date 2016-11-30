/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_group.js
 */

module.exports = {
    malloc: function (root_object_val, group_id_val, topic_data_val, cluster_id_val) {
        return new MatrixGroupObject(root_object_val, group_id_val, topic_data_val, cluster_id_val);
    },
};

function MatrixGroupObject (root_object_val, group_id_val, cluster_id_val, topic_data_val) {
    "use strict";

    this.init__ = function (root_object_val, group_id_val, cluster_id_val, topic_data_val) {
        this.theRootObject = root_object_val;
        this.theJointObject = this.importListMgr().malloc_joint(group_id_val);
        this.theClusterId = cluster_id_val;
        this.theTransmitQueue = this.importObject().mallocQueue();
        this.theTopicBaseId = 0;
        this.createTopic(topic_data_val);
        this.theTopicMgrObject = this.importObject().importTopicMgr().malloc(this);
        this.debug(false, "init__", "groupId=" + this.groupId());
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

    this.clusterId = function () {
        return this.theClusterId;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.jointObject = function () {
        return this.theJointObject;
    };

    this.topicMgrObject111 = function () {
        return this.rootObject().topicMgrObject111();
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

    this.groupId = function () {
        return this.jointObject().entryId();
    };

    this.topicBaseId = function () {
        return this.theTopicBaseId;
    };

    this.setTopicBaseId = function (val) {
        this.theTopicBaseId = val;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.createTopic = function (topic_data_val) {
        var topic_data = JSON.parse(topic_data_val);
        if (topic_data.title === "go") {
            this.setTopicBaseId(this.topicMgrObject111().topicMallocBase());
            this.debug(false, "createTopic", "base_id=" + this.topicBaseId());
        }
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

    this.processSetupTopicData = function (json_data_val) {
        this.debug(true, "processSetupTopicData", "data=" + json_data_val);
        var topic_data = JSON.parse(json_data_val);
        if (topic_data.command === "config") {
            this.topicObject().configObject().createConfig(topic_data.data);
        }
    };

    this.receiveData = function (data_val) {
        this.topicMgrObject111().topicReceiveData(this.topicBaseId(), data_val);
        var data = this.topicMgrObject111().topicTransmitData(this.topicBaseId());
        require("../fabric_modules/fabric_cluster_mgr.js").receive_data(this.clusterId(), data);
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

    this.init__(root_object_val, group_id_val, cluster_id_val, topic_data_val);
}
