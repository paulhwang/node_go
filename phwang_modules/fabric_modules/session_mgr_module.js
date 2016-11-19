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

    this.init__ = function (link_val) {
        this.theLinkObject = link_val;
        this.theHead = null;
        this.theTail = null;
        this.theSize = 0;
        this.theGlobalSessionId = 1000;
    };

    this.sessionModuleMalloc = function (session_mgr_val, session_id_val) {
        var session_module = require("./session_module.js");
        return session_module.malloc(session_mgr_val, session_id_val);
    };

    this.clusterModuleMalloc = function () {
        return this.fabricObject().clusterMgrObject().mallocCluster();
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

    this.fabricObject = function () {
        return this.linkMgrObject().fabricObject();
    };

    this.rootObject = function () {
        return this.fabricObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.globalSessionId = function () {
        return this.theGlobalSessionId;
    };

    this.incrementGlobalSessionId = function () {
        this.theGlobalSessionId += 1;
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

    this.mallocSession = function () {
        var session = this.sessionModuleMalloc(this, this.globalSessionId());
        this.incrementGlobalSessionId();
        this.insertSessionToList(session);
        return session;
    };

    this.freeSession = function (session_val) {
        this.deleteSessionFromList(session_val);
    };

    this.insertSessionToList = function (session_val) {
        if (!session_val) {
            this.abend("enQueue", "null session_val");
            return;
        }

        this.abendIt();

        this.incrementSize();
        if (!this.head()) {
            session_val.setPrev(null);
            session_val.setNext(null);
            this.setHead(session_val);
            this.setTail(session_val);
        } else {
            this.tail().setNext(session_val);
            session_val.setPrev(this.tail());
            session_val.setNext(null);
            this.setTail(session_val);
        }
        this.abendIt();
    };

    this.deleteSessionFromList = function (session_val) {
        if (this.size() <= 0) {
            this.abend("deleteSessionFromList", "size=" + this.size());
            return;
        }
        if (!this.sessionExistInTheList(session_val)) {
            this.abend("deleteSessionFromList", "sessionExistInTheList is false");
            return;
        }

        this.abendIt();
        if (session_val.prev()) {
            session_val.prev().setNext(session_val.next());
        } else {
            this.setHead(session_val.next());
        }
        if (session_val.next()) {
            session_val.next().setPrev(session_val.prev());
        } else {
            this.setTail(session_val.prev());
        }
        this.decrementSize();
        this.abendIt();
    };

    this.searchSessionBySessionId = function (session_id_val) {
        var session = this.head();
        while (session) {
            if (session.sessionId() === session_id_val) {
                return session;
            }
            session = session.next();
        }
        return null;
    };

    this.sessionExistInTheList = function (session_val) {
        var session = this.head();
        while (session) {
            if (session === session_val) {
                return true;
            }
            session = session.next();
        }
        return false;
    };

    this.getPendingSessionData = function () {
        var data = [];
        var i = 0;
        var session = this.head();
        while (session) {
            if (session.transmitQueue().size() > 0) {
                data[i] =  session.sessionId();
                i += 1;
            }
            session = session.next();
        }
        if (i === 0) {
            return null;
        }
        else {
            return data;
        }
    };

    this.abendIt = function () {
        var i = 0;
        var session = this.head();
        while (session) {
            session = session.next();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "head: size=" + this.size() + " i=" + i);
        }

        i = 0;
        session = this.tail();
        while (session) {
            session = session.prev();
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

    this.init__(link_val);
}
