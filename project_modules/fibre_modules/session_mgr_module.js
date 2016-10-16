/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_mgr_module.js
 */

module.exports = {
    malloc: function (fibre_val) {
        return new SessionMgrObject(fibre_val);
    },
};

function SessionMgrObject(fibre_val) {
    "use strict";
    this.theFibreObject = fibre_val;

    this.sessionModuleMalloc = function (session_mgr_val, my_name_val, his_name_val, session_id_val, cluster_val) {
        var session_module = require("./session_module.js");
        return session_module.malloc(session_mgr_val, my_name_val, his_name_val, session_id_val, cluster_val);
    };

    this.clusterModuleMalloc = function () {
        return this.fibreObject().clusterMgrObject().mallocCluster();
    };

    this.sessionModule = function () {
        return require("./session_entry_module.js");
    };

    this.objectName = function () {
        return "SessionMgrObject";
    };

    this.fibreObject = function () {
        return this.theFibreObject;
    };

    this.rootObject = function () {
        return this.fibreObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.sessionQueue = function () {
        return this.theSessionQueue;
    };

    this.poolQueue = function () {
        return this.thePoolQueue;
    };

    this.preSessionQueue = function () {
        return this.thePreSessionQueue;
    };

    this.globalSessionId = function () {
        return this.theGlobalSessionId;
    };

    this.incrementGlobalSessionId = function () {
        return this.theGlobalSessionId += 1;
    };

    this.searchIt = function (my_name_val, his_name_val, session_id_val) {
        return this.sessionQueue().searchIt(function (session_val, my_name_val, his_name_val, session_id_val) {
            return ((my_name_val === session_val.myName()) &&
                    (his_name_val === session_val.hisName()) &&
                    ((session_id_val === session_val.sessionId()) || (session_id_val === 0)));
        }, my_name_val, his_name_val, session_id_val);
    };

    this.searchAndCreate = function (my_name_val, his_name_val, session_id_val) {
        var session = this.searchIt(my_name_val, his_name_val, session_id_val);
        if (!session) {
            var cluster = this.clusterModuleMalloc();
            session = this.mallocSession(my_name_val, his_name_val, cluster);
            this.sessionQueue().enQueue(session);

            if (my_name_val === his_name_val) {
                session.setHisName(his_name_val);
                session.setHisSession(session);
            } else {
                var his_session = this.mallocSession(his_name_val, my_name_val, cluster);
                session.setHisSession(his_session);
                his_session.setHisSession(session);
                this.sessionQueue().enQueue(his_session);
            }
        }
        return session;
    };

    this.mallocSession = function (my_name_val, his_name_val, cluster_val) {
        var entry = this.poolQueue().deQueue();  
        if (!entry) {
            entry = this.sessionModuleMalloc(this, my_name_val, his_name_val, this.globalSessionId(), cluster_val);
        } else {
            entry.resetIt(my_name_val, his_name_val, this.globalSessionId(), cluster_val);
        }
        this.incrementGlobalSessionId();
        return entry;
    };

    this.freeSession = function (session_val) {
        this.poolQueue().enQueue(link_val);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theSessionQueue = this.utilObject().mallocQueue();
    this.thePreSessionQueue = this.utilObject().mallocQueue();
    this.thePoolQueue = this.utilObject().mallocQueue();
    this.theGlobalSessionId = 1000;
}
