/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_theme.js
 */

module.exports = {
    malloc: function (root_object_val, theme_id_val, theme_name_val) {
        return new MatrixThemeObject(root_object_val, theme_id_val, theme_name_val);
    },
};

function MatrixThemeObject (root_object_val, theme_id_val, theme_name_val) {
    "use strict";

    this.init__ = function (root_object_val, theme_id_val, theme_name_val) {
        this.theObjectObject = root_object_val;
        this.theJointObject = this.importListMgr().malloc_joint(theme_id_val, theme_name_val);
        this.theSlotMgrObject = this.importObject().importSlotMgr().malloc(this);
        this.debug(true, "init__", "themeId=" + this.themeId() + " themeName=" + this.themeName());
    };

    this.objectName = function () {
        return "MatrixThemeObject";
    };

    this.rootObject = function () {
        return this.theObjectObject;
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

    this.themeId = function () {
        return this.jointObject().entryId();
    };

    this.themeName = function () {
        return this.jointObject().entryName();
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

    this.init__(root_object_val, theme_id_val, theme_name_val);
}
