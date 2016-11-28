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
};

function MatrixGroupMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theGlobalGroupId = 100;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "MatrixGroupMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.clusterBaseObject = function () {
        return this.rootObject().clusterBaseObject();
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

    this.mallocGroup = function (data_val, session_val) {
        var group = this.rootObject().importObject().importGroup().malloc(this.rootObject(), data_val, session_val);
        this.incrementGlobalGroupId();
        return group;
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

