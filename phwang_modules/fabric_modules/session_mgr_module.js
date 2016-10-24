/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_mgr_module.js
 */

module.exports = {
    malloc: function (link_val) {
        return new SessionMgrObject(link_val);
    },
};

function SessionMgrObject(link_val) {
    "use strict";
    this.theLinkObject = link_val;

    this.sessionModuleMalloc = function (session_mgr_val, session_id_val) {
        var session_module = require("./session_module.js");
        return session_module.malloc(session_mgr_val, session_id_val);
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

    this.linkObject = function () {
        return this.theLinkObject;
    };

    this.linkMgrObject = function () {
        return this.linkObject().linkMgrObject();
    };

    this.fibreObject = function () {
        return this.linkMgrObject().fibreObject();
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

    this.preSessionQueue = function () {
        return this.thePreSessionQueue;
    };

    this.globalSessionId = function () {
        return this.theGlobalSessionId;
    };

    this.incrementGlobalSessionId = function () {
        this.theGlobalSessionId += 1;
    };

    this.searchSessionBySessionId = function (session_id_val) {
        return this.sessionQueue().searchIt(function (session_val, session_id_val) {
            return session_id_val === session_val.sessionId();
        }, session_id_val);
    };

    this.searchSession = function (my_name_val, his_name_val, session_id_val) {
        return this.sessionQueue().searchIt(function (session_val, my_name_val, his_name_val, session_id_val) {
            return ((my_name_val === session_val.myName()) &&
                    (his_name_val === session_val.hisName()) &&
                    ((session_id_val === session_val.sessionId()) || (session_id_val === 0)));
        }, my_name_val, his_name_val, session_id_val);
    };

    this.searchAndCreate = function (my_name_val, his_name_val, session_id_val) {
        var session = this.searchSession(my_name_val, his_name_val, session_id_val);
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

    this.mallocSession = function () {
        var session = this.sessionModuleMalloc(this, this.globalSessionId());
        this.incrementGlobalSessionId();
        this.sessionQueue().enQueue(session);
        return session;
    };

    this.freeSession = function (session_val) {
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
    this.theGlobalSessionId = 1000;
}
