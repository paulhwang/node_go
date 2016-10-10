/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_handler_module.js
 */

module.exports = {
    malloc: function (container_val) {
        return new GoHandlerObject(container_val);
    },
};

function GoHandlerObject(container_val) {
    "use strict";

    this.theObjectName = "GoHandlerObject";
    this.theContainerObject = container_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.GO = function () {
        return this.containerObject().GO();
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.portObject = function () {
        return this.containerObject().portObject();
    };

    this.uiObject = function () {
        return this.containerObject().uiObject();
    };

    this.engineObject = function () {
        return this.containerObject().engineObject();
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };
}

