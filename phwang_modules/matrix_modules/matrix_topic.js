/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_topic.js
 */

module.exports = {
    malloc: function (root_object_val, topic_id_val) {
        return new MatrixTopicObject(root_object_val, topic_id_val);
    },
};

function MatrixTopicObject (root_object_val, topic_id_val) {
    "use strict";

    this.init__ = function (root_object_val, topic_id_val) {
        this.theRootObject = root_object_val;
        this.theJointObject = this.importListMgr().malloc_joint(topic_id_val);
        this.theTopicBaseId = 0;
        this.debug(true, "init__", "topicId=" + this.topicId());
    };

    this.objectName = function () {
        return "MatrixTopicObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.clusterObject = function () {
        return this.theClusterObject;
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

    this.topicMgrObject = function () {
        return this.rootObject().topicMgrObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.topicId = function () {
        return this.jointObject().entryId();
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

    this.init__(root_object_val, topic_id_val);
}
