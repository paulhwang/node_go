/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: import.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new ClusterImportClass(root_object_val);
    },
};

function ClusterImportClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theClusterRootObject = root_object_val;
    };

    this.clusterRootObject = function () {
        return this.theClusterRootObject;
    };

    this.rootObject = function () {
        return this.clusterRootObject().rootObject();
    };

    this.importClusterBase = function () {
        return require("../cluster_modules/cluster_base.js");
    }

    this.importCluster = function () {
        return require("../cluster_modules/cluster.js");
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
