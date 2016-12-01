/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_slot_mgr.js
 */

module.exports = {
    malloc: function (theme_object_val) {
        return new MatrixSlotMgrObject(theme_object_val);
    },
};

function MatrixSlotMgrObject (theme_object_val) {
    "use strict";

    this.init__ = function (theme_object_val) {
        this.theThemeObject = theme_object_val;
        this.theSlotListObject = this.importObject().importListMgr().malloc_mgr(this.themeObject(), 100);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "MatrixSlotMgrObject";
    };

    this.themeObject = function () {
        return this.theThemeObject;
    };

    this.rootObject = function () {
        return this.themeObject().rootObject();
    };

    this.slotListObject = function () {
        return this.theSlotListObject;
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

    this.init__(theme_object_val);
}
