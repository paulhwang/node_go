/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_entry_module.js
 */

module.exports = {
    malloc: function () {
        var entry = new HolderEntryObject();
        return entry;
    },
};

function HolderEntryObject() {
    "use strict";

    this.init__ = function () {
        this.theData = null;
        this.thePrev = null;
        this.theNext = null;
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "HolderEntryObject";
    };

    this.data = function () {
        return this.theData;
    };

    this.setData = function (val) {
        this.theData = val;
    };

    this.prev = function () {
        return this.thePrev;
    };

    this.setPrev = function (val) {
        this.thePrev = val;
    };

    this.next = function () {
        return this.theNext;
    };

    this.setNext = function (val) {
        this.theNext = val;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        require("../phwang_module.js").LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        require("../phwang_module.js").ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__();
}
