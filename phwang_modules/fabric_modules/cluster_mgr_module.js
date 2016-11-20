/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: cluster_mgr_module.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new clusterMgrObject(root_object_val);
    },
};

function clusterMgrObject(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theFabricObject = root_object_val;
        this.theHead = null;
        this.theTail = null;
        this.theSize = 0;
        this.theGlobalClusterId = 100;
        this.theClusterQueue = this.rootObject().mallocQueue();
        this.thePoolQueue = this.rootObject().mallocQueue();
        this.debug(false, "init__", "");
    };

    this.clusterModuleMalloc = function (topic_data_val, session_val) {
        var cluster_module = require("./cluster_module.js");
        return cluster_module.malloc(this, topic_data_val, session_val);
    };

    this.objectName = function () {
        return "clusterMgrObject";
    };

    this.fabricObject = function () {
        return this.theFabricObject;
    };

    this.rootObject = function () {
        return this.fabricObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.clusterQueue = function () {
        return this.theClusterQueue;
    };

    this.globalClusterId = function () {
        return this.theGlobalClusterId;
    };

    this.incrementGlobalClusterId = function () {
        this.theGlobalClusterId += 1;
    };

    this.head = function () {
        return this.theHead;
    }

    this.setHead = function (val) {
        this.theHead = val;
    }

    this.tail = function () {
        return this.theTail;
    }

    this.setTail = function (val) {
        this.theTail = val;
    }

    this.size = function () {
        return this.theSize;
    }

    this.incrementSize = function () {
        this.theSize += 1;
    }

    this.decrementSize = function () {
        this.theSize -= 1;
    }

    this.mallocCluster = function (data_val, session_val) {
        var cluster = this.clusterModuleMalloc(data_val, session_val);
        this.incrementGlobalClusterId();
        return cluster;
    };

    this.freeCluster = function (cluster_val) {
    };

    this.insertClusterToList = function (cluster_val) {
        if (!cluster_val) {
            this.abend("insertClusterToList", "null cluster_val");
            return;
        }

        this.abendIt();

        this.incrementSize();
        if (!this.head()) {
            cluster_val.setPrev(null);
            cluster_val.setNext(null);
            this.setHead(cluster_val);
            this.setTail(cluster_val);
        } else {
            this.tail().setNext(cluster_val);
            cluster_val.setPrev(this.tail());
            cluster_val.setNext(null);
            this.setTail(cluster_val);
        }
        this.abendIt();
    };

    this.deleteClusterFromList = function (cluster_val) {
        if (this.size() <= 0) {
            this.abend("deleteClusterFromList", "size=" + this.size());
            return;
        }
        if (!this.clusterExistInTheList(cluster_val)) {
            this.abend("deleteClusterFromList", "clusterExistInTheList is false");
            return;
        }

        this.abendIt();
        if (cluster_val.prev()) {
            cluster_val.prev().setNext(cluster_val.next());
        } else {
            this.setHead(cluster_val.next());
        }
        if (cluster_val.next()) {
            cluster_val.next().setPrev(cluster_val.prev());
        } else {
            this.setTail(cluster_val.prev());
        }
        this.decrementSize();
        this.abendIt();
    };

    this.clusterExistInTheList = function (cluster_val) {
        var cluster = this.head();
        while (cluster) {
            if (cluster === cluster_val) {
                return true;
            }
            cluster = cluster.next();
        }
        return false;
    };

    this.abendIt = function () {
        var i = 0;
        var cluster = this.head();
        while (cluster) {
            cluster = cluster.next();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "head: size=" + this.size() + " i=" + i);
        }

        i = 0;
        cluster = this.tail();
        while (cluster) {
            cluster = cluster.prev();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "tail: size=" + this.size() + " i=" + i);
        }
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
