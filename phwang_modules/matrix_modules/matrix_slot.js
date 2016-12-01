/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_slot.js
 */

module.exports = {
    malloc: function (theme_object_val, slot_id_val) {
        return new MatrixSlotClass(theme_object_val, slot_id_val);
    },
};

function MatrixSlotClass (theme_object_val, slot_id_val) {
    "use strict";

    this.init__ = function (theme_object_val, slot_id_val) {
        this.theThemeObject = theme_object_val;
        this.theJointObject = this.importListMgr().malloc_joint(slot_id_val);
        this.debug(true, "init__", "slotId=" + this.slotId());
    };

    this.objectName = function () {
        return "MatrixSlotClass";
    };

    this.themeObject = function () {
        return this.theThemeObject;
    };

    this.rootObject = function () {
        return this.themeObject().rootObject();
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

    this.slotId = function () {
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

    this.init__(theme_object_val, slot_id_val);
}
