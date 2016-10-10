/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_mgr_module.js
 */

var theSessionMgrObject;

module.exports = {
    malloc: function (root_object_val) {
        theSessionMgrObject = new SessionMgrObject(root_object_val);
    },

    object: function () {
        return theSessionMgrObject;
    },
};

function SessionMgrObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.sessionModuleMalloc = function (session_mgr_val, my_name_val, his_name_val, session_id_val, cluster_val) {
        var session_module = require("./session_entry_module.js");
        return session_module.malloc(session_mgr_val, my_name_val, his_name_val, session_id_val, cluster_val);
    };

    this.clusterModuleMalloc = function () {
        var cluster_module = require("./cluster_module.js");
        return cluster_module.malloc();
    };

    this.sessionModule = function () {
        return require("./session_entry_module.js");
    };

    this.queueModule = function () {
        return this.rootObject().queueModule();
    };

    this.objectName = function () {
        return "SessionMgrObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
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

    this.poolHead = function () {
        return this.thePoolHead;
    };

    this.setHead = function (val) {
        this.thePoolHead = val;
    };

    this.globalSessionId = function () {
        return this.theGlobalSessionId;
    };

    this.incrementGlobalSessionId = function () {
        return this.theGlobalSessionId += 1;
    };

    this.poolSize = function () {
        return this.thePoolSize;
    };

    this.incrementPoolSize = function () {
        return this.thePoolSize += 1;
    };

    this.decrementPoolSize = function () {
        return this.thePoolSize -= 1;
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
            session = this.mallocIt(my_name_val, his_name_val, cluster);
            this.sessionQueue().enQueue(session);

            if (my_name_val === his_name_val) {
                session.setHisName(his_name_val);
                session.setHisSession(session);
            } else {
                var his_session = this.mallocIt(his_name_val, my_name_val, cluster);
                session.setHisSession(his_session);
                his_session.setHisSession(session);
                this.sessionQueue().enQueue(his_session);
            }
        }
        return session;
    };

    this.mallocIt = function (my_name_val, his_name_val, cluster_val) {
        var entry;

        if (!this.poolHead()) {
            entry = this.sessionModuleMalloc(this, my_name_val, his_name_val, this.globalSessionId(), cluster_val);
        } else {
            entry = this.poolHead();
            entry.resetIt(my_name_val, his_name_val, this.globalSessionId(), cluster_val);
            this.setHead(entry.next());
            this.decrementPoolSize();
        }
        this.incrementGlobalSessionId();

        this.abendIt();
        return entry;
    };

    this.freeIt = function (entry_val) {
        this.incrementPoolSize();
        entry_val.setNext(this.poolHead());
        this.setHead(entry_val);
        this.abendIt();
    };

    this.abendIt = function () {
        var i = 0;
        var p = this.poolHead();
        while (p) {
            p = p.next();
            i += 1;
        }
        if (i !== this.poolSize()) {
            this.abend("abendIt", "size=" + this.poolSize() + " i=" + i);
        }

        if (this.poolSize() > 5) {
            this.abend("abendIt", "size=" + this.poolSize());
        }
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theSessionQueue = this.queueModule().malloc();
    this.thePreSessionQueue = this.queueModule().malloc();
    this.theGlobalSessionId = 1000;
    this.thePoolHead = null;
    this.thePoolSize = 0;
}