/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_topic.js
 */

module.exports = {
    malloc: function (root_object_val, topic_id_val, topic_name_val) {
        return new MatrixTopicClass(root_object_val, topic_id_val, topic_name_val);
    },
};

function MatrixTopicClass (root_object_val, topic_id_val, topic_name_val) {
    "use strict";

    this.init__ = function (root_object_val, topic_id_val, topic_name_val) {
        this.theGroupObject = root_object_val;
        this.theJointObject = this.importListMgr().malloc_joint(topic_id_val, topic_name_val);
        this.theTopicBaseId = 0;
        this.debug(true, "init__", "topicId=" + this.topicId());
    };

    this.objectName = function () {
        return "MatrixTopicClass";
    };

    this.groupObject = function () {
        return this.theGroupObject;
    };

    this.rootObject = function () {
        return this.groupObject().rootObject();
    };

    this.jointObject = function () {
        return this.theJointObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.clusterId = function () {
        return this.groupObject().clusterId();
    };

    this.topicId = function () {
        return this.jointObject().entryId();
    };

    this.topicName = function () {
        return this.jointObject().entryName();
    };

    this.slotId = function () {
        return this.theSLotId;
    };

    this.setSlotId = function (val) {
        this.theSLotId = val;
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

    this.init__(root_object_val, topic_id_val, topic_name_val);
}
