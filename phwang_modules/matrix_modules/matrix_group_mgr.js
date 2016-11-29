/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_group_mgr.js
 */

var the_matrix_group_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        the_matrix_group_mgr_object = new MatrixGroupMgrClass(root_object_val);
        return the_matrix_group_mgr_object;
    },

    malloc_group: function (data_val, session_val) {
        return the_matrix_group_mgr_object.mallocGroup(data_val, session_val);
    },

    receive_data: function (group_object_val, data_val) {
        the_matrix_group_mgr_object.receiveData(group_object_val, data_val);
    },
};

function MatrixGroupMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theGroupListObject = this.importObject().importListMgr().malloc_mgr(this, 200);
        this.theGlobalGroupId = 100;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "MatrixGroupMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.groupListObject = function () {
        return this.theGroupListObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.globalGroupId = function () {
        return this.theGlobalGroupId;
    };

    this.incrementGlobalGroupId = function () {
        this.theGlobalGroupId += 1;
    };

    this.mallocGroup = function (data_val, cluster_val) {
        var group = this.rootObject().importObject().importGroup().malloc(this.rootObject(), data_val, cluster_val);
        this.groupListObject().insertEntry(group);
        this.incrementGlobalGroupId();
        return group;
    };

    this.receiveData = function (group_object_val, data_val) {
        group_object_val.receiveData(data_val);
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

