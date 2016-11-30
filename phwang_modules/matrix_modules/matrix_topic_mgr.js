/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_topic_mgr.js
 */

var the_matrix_topic_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_matrix_topic_mgr_object) {
            the_matrix_topic_mgr_object = new MatrixTopicMgrClass(root_object_val);
        }
        return the_matrix_topic_mgr_object;
    },
};

function MatrixTopicMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theTopicListObject = this.importObject().importListMgr().malloc_mgr(this, 100);
        this.debug(true, "init__", "");
        this.mallocTopic();
    };

    this.objectName = function () {
        return "MatrixTopicMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.topicListObject = function () {
        return this.theTopicListObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.topicMallocBase = function () {
        return require("../go_modules/go_base_mgr.js").malloc_base();
    };

    this.topicReceiveData = function (base_id_val, data_val) {
        require("../go_modules/go_base_mgr.js").receive_data(base_id_val, data_val);
    };

    this.topicTransmitData = function (base_id_val) {
        return require("../go_modules/go_base_mgr.js").transmit_data(base_id_val);
    };

    this.mallocTopic = function () {
        var topic = this.importObject().importTopic().malloc(this.rootObject(), this.topicListObject().allocId());
        this.topicListObject().enQueue(topic);
        this.debug(false, "mallocTopic", "topicId=" + topic.topicId());
        return topic.topicId();
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

