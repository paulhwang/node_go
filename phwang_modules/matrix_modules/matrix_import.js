/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_import.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new MatrixImportClass(root_object_val);
    },
};

function MatrixImportClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
    };

    this.objectName = function () {
        return "MatrixImportClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importTopicMgr = function () {
        return require("./matrix_topic_mgr.js");
    }

    this.importGroupMgr = function () {
        return require("./matrix_group_mgr.js");
    }

    this.importGroup = function () {
        return require("./matrix_group.js");
    }

    this.importTopic = function () {
        return require("./matrix_topic.js");
    }

    this.importListMgr = function () {
        return require("../util_modules/list_mgr.js");
    };

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
