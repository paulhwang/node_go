/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_import.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new ImportObject(root_object_val);
    },
};

function ImportObject (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importListMgr = function () {
        return require("../util_modules/list_mgr.js");
    };

    this.importBase = function () {
        return require("../go_modules/go_base.js");
    };

    this.importMove = function () {
        return require("./go_move.js");
    }

    this.importLogit = function () {
        return require("../util_modules/logit.js");
    }

    this.mallocQueue = function () {
        return require("../util_modules/queue.js").malloc(this.rootObject());
    };

    this.mallocRing = function () {
        return require("../util_modules/ring.js").malloc(this.rootObject());
    };

    this.init__(root_object_val);
};
