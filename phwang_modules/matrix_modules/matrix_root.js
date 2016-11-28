/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_root.js
 */

var the_matrix_root_object = new MatrixRootClass();

module.exports = {
};

function MatrixRootClass () {
    "use strict";

    this.init__ = function () {
        this.theImportObject = require("./matrix_import.js").malloc(this);
        this.theTopicListObject = this.importObject().importListMgr().malloc_mgr(this, 0);
        this.theTopicMgrObject = this.importObject().importTopicMgr().malloc(this);
        this.theGroupMgrObject = this.importObject().importGroupMgr().malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "MatrixRootClass";
    };

    this.setRootObject = function (val) {
        return this.theRootObject = val;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importObject = function () {
        return this.theImportObject;
    };

    this.topicMgrObject = function () {
        return this.theTopicMgrObject;
    };

    this.groupMgrObject = function () {
        return this.theGroupMgrObject;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        this.importObject().importLogit().LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        this.importObject().importLogit().ABEND(str1_val, str2_val);
    };

    this.init__();
};
