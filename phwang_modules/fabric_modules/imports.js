/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: import.js
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

    this.importBase = function () {
        return require("./base.js");
    }

    this.importSwitch = function () {
        return require("./switch.js");
    };

    this.importAjax = function () {
        return require("./ajax.js");
    };

    this.importLink = function () {
        return require("./link.js");
    }

    this.importSession = function () {
        return require("./session.js");
    }

    this.importClusterBase = function () {
        return require("./cluster_base.js");
    }

    this.importCluster = function () {
        return require("./cluster.js");
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
