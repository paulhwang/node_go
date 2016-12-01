/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_theme_mgr.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new MatrixThemeMgrObject(root_object_val);
    },
};

function MatrixThemeMgrObject (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theThemeListObject = this.importObject().importListMgr().malloc_mgr(this, 100);
        this.debug(true, "init__", "");

        this.createTheme11111();
    };

    this.objectName = function () {
        return "MatrixThemeMgrObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.themeListObject = function () {
        return this.theThemeListObject;
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

    this.createTheme11111 = function () {
        var theme = this.importObject().importTheme().malloc(this, this.themeListObject().allocId());
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
