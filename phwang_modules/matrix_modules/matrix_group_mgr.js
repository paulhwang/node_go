/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_group_mgr.js
 */

var the_matrix_group_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (the_matrix_group_mgr_object) {
            return;
        }
        the_matrix_group_mgr_object = new MatrixGroupMgrClass(root_object_val);
        return the_matrix_group_mgr_object;
    },

    malloc_group: function (data_val, cluster_id_val) {
        return the_matrix_group_mgr_object.mallocGroup(data_val, cluster_id_val);
    },

    receive_data: function (group_id_val, data_val) {
        the_matrix_group_mgr_object.receiveData(group_id_val, data_val);
    },
};

function MatrixGroupMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theGroupListObject = this.importObject().importListMgr().malloc_mgr(this, 200);
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

    this.mallocGroup = function (data_val, cluster_id_val) {
        var group = this.importObject().importGroup().malloc(this.rootObject(), this.groupListObject().allocId(), data_val, cluster_id_val);
        this.groupListObject().insertEntry(group);
        return group.groupId();
    };

    this.receiveData = function (group_id_val, data_val) {
        var group = this.groupListObject().searchId(group_id_val);
        if (!group) {
            return;
        }
        group.receiveData(data_val);
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

