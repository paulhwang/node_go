/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fibre_module.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new FibreObject(root_object_val);
    },
};

function FibreObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.mallocModules = function () {
        var link_mgr_module = require("./link_mgr_module.js");
        var session_mgr_module = require("./session_mgr_module.js");
        var cluster_mgr_module = require("./cluster_mgr_module.js");

        this.theLinkMgrObject = link_mgr_module.malloc(this);
        this.theSessionMgrObject = session_mgr_module.malloc(this);
        this.theClusterMgrObject = cluster_mgr_module.malloc(this);
    };

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(my_name_val, link_id_val);
    };

    this.objectName = function () {
        return "FibreObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkMgrObject = function () {
        return this.theLinkMgrObject;
    };

    this.sessionMgrObject = function () {
        return this.theSessionMgrObject;
    };

    this.clusterMgrObject = function () {
        return this.theClusterMgrObject;
    };

    this.mallocModules();
}
