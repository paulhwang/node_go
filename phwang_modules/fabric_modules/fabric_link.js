/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_module.js
 */

module.exports = {
    malloc: function (root_object_val, link_id_val, link_name_val) {
        return new FabricLinkClass(root_object_val, link_id_val, link_name_val);
    },
};

function FabricLinkClass(root_object_val, link_id_val, link_name_val) {
    "use strict";

    this.init__ = function (root_object_val, link_id_val, link_name_val) {
        this.theRootObject  = root_object_val;
        this.theLinkId = link_id_val;
        this.theLinkName = link_name_val;
        this.theSessionListObject = this.importListMgr().malloc_mgr(this, 10000);
        this.theGlobalSessionId = 1000;
        this.theSessionIndexArray = [0];
        this.theSessionTableArray = [null];
        this.up_seq = 0;
        this.down_seq = 0;
        this.theReceiveQueue = this.importObject().mallocQueue();
        this.thePendingSessionSetupQueue = this.importObject().mallocQueue();
        this.theNameListChanged = true;
        this.theKeepAliveTimer = null;
        this.debug(true, "init__", "linkId=" + this.linkId() + " linkName=" + this.linkName());
    };

    this.linkTimeoutInterval = function () {
        return 30000;
    };

    this.objectName = function () {
        return "FabricLinkClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkId = function () {
        return this.theLinkId;
    };

    this.linkName = function () {
        return this.theLinkName;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.linkMgrObject = function () {
        return this.rootObject().linkMgrObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.sessionListObject = function () {
        return this.theSessionListObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.sessionIndexArray = function () {
        return this.theSessionIndexArray;
    };

    this.sessionTableArray = function () {
        return this.theSessionTableArray;
    };

    this.sessionTableArrayLength = function () {
        return this.sessionTableArray().length;
    };

    this.sessionTableArrayElement = function (val) {
        return this.sessionTableArray()[val];
    };

    this.globalSessionId = function () {
        return this.theGlobalSessionId;
    };

    this.incrementGlobalSessionId = function () {
        this.theGlobalSessionId += 1;
    };

    this.allocSessionId = function () {
        this.incrementGlobalSessionId();
        return this.globalSessionId();
    }

    this.myName = function () {
        return this.linkName();
    };

    this.keepAliveTimer = function () {
        return this.theKeepAliveTimer;
    };

    this.setKeepAliveTimer = function (val) {
        this.theKeepAliveTimer = val;
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.receiveRing = function () {
        return this.theReceiveRing;
    };

    this.pendingSessionSetupQueue = function () {
        return this.thePendingSessionSetupQueue;
    };

    this.nameListChanged = function () {
        return this.theNameListChanged;
    };

    this.setNameListChanged = function () {
        this.theNameListChanged = true;
    };

    this.clearNameListChanged = function () {
        this.theNameListChanged = false;
    };

    this.resetKeepAliveTimer = function () {
        this.debug(false, "keepAlive", "my_name=" + this.my_name + " link_id=" + this.link_id);
        this.setKeepAliveTimer(this.resetTimeout());
    };

    this.resetTimeout = function () {
        if (this.keepAliveTimer()) {
            clearTimeout(this.keepAliveTimer());
        }
        this.debug(false, "resetTimeout", "my_name=" + this.my_name + " link_id=" + this.link_id);
        var time_out = setTimeout(function (link_val) {
            console.log("resetTimeout(***timeout occurs)", "my_name=" + link_val.myName() + " link_id=" + link_val.linkId());
            link_val.linkMgrObject().unQueueLink(link_val);
        }, this.linkTimeoutInterval(), this);
        return time_out;
    };

    this.searchSessionBySessionId = function (session_id_val) {
        return this.sessionListObject().searchId(session_id_val);
    };

    this.mallocSession = function () {
        var session1 = this.importObject().importSession().malloc(this, this.allocSessionId());
        this.sessionIndexArray().push(session1.sessionId());
        this.sessionTableArray().push(session1);
        var session = this.importObject().importSession().malloc(this, this.sessionListObject().allocId());
        this.sessionListObject().enQueue(session);
        return session1;
    };

    this.getSession = function (session_id_val) {
        var index = this.sessionIndexArray().indexOf(session_id_val);
        if (index === -1) {
            return null;
        } else {
            var session =this.sessionTableArray()[index];
            return session;
        }
    };

    this.getPendingSessionData = function () {
        var data = [];
        var i = 0;
        var session = this.sessionListObject().head();
        while (session) {
            if (session.transmitQueue().size() > 0) {
                data[i] =  session.sessionId();
                i += 1;
            }
            session = session.jointObject().next_();
        }
        if (i === 0) {
            return null;
        }
        else {
            return data;
        }
    };

    this.getPendingSessionSetup = function () {
        return this.pendingSessionSetupQueue().deQueue();
    };

    this.setPendingSessionSetup = function (session_val, topic_data_val) {
        this.pendingSessionSetupQueue().enQueue(JSON.stringify({session_id: session_val.sessionId(),
                                                                topic_data: topic_data_val
                                                                }));
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

    this.init__(root_object_val, link_id_val, link_name_val);
}
