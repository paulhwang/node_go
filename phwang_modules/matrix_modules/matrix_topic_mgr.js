/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_group.js
 */

module.exports = {
    malloc: function (group_object_val) {
        return new MatrixTopicMgrObject(group_object_val);
    },
};

function MatrixTopicMgrObject (group_object_val) {
    "use strict";

    this.init__ = function (group_object_val) {
        this.theGroupObject = group_object_val;
        this.theTopicListObject = this.importObject().importListMgr().malloc_mgr(this.groupObject(), 100);
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "MatrixTopicMgrObject";
    };

    this.groupObject = function () {
        return this.theGroupObject;
    };

    this.rootObject = function () {
        return this.groupObject().rootObject();
    };

    this.topicListObject = function () {
        return this.theTopicListObject;
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

    this.addTopic = function (topic_data_val) {
        var topic = this.importObject().importTopic().malloc(this.groupObject(), this.topicListObject().allocId());
        this.topicListObject().enQueue(topic);
        topic.createBase(topic_data_val);



        return topic;///////////////////////
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

    this.init__(group_object_val);
}
