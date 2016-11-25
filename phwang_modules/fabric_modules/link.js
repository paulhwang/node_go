/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_module.js
 */

module.exports = {
    malloc: function (root_object_val, my_name_val, link_id_val) {
        return new LinkObject(root_object_val, my_name_val, link_id_val);
    },
};

function LinkObject(root_object_val, my_name_val, link_id_val) {
    "use strict";

    this.init__ = function (root_object_val, my_name_val, link_id_val) {
        this.theRootObject  = root_object_val;
        this.theLinkId = link_id_val;
        this.theMyName = my_name_val;
        this.theSessionMgrObject = this.rootObject().importObject().importSessionMgr().malloc(this);
        this.up_seq = 0;
        this.down_seq = 0;
        this.theReceiveQueue = this.rootObject().importObject().mallocQueue();
        this.thePendingSessionSetupQueue = this.rootObject().importObject().mallocQueue();
        this.theNameListChanged = true;
        this.theKeepAliveTimer = null;
        this.thePrev = null;
        this.theNext = null;
        this.debug(true, "init__", "link_id=" + this.linkId());
    };

    this.linkTimeoutInterval = function () {
        return 30000;
    };

    this.objectName = function () {
        return "LinkObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.sessionMgrObject = function () {
        return this.theSessionMgrObject;
    };

    this.utilObject = function () {
        return this.linkMgrObject().utilObject();
    };

    this.linkId = function () {
        return this.theLinkId;
    };

    this.setLinkId = function (val) {
        this.theLinkId = val;
    };

    this.myName = function () {
        return this.theMyName;
    };

    this.setMyName = function (val) {
        this.theMyName = val;
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

    this.prev = function () {
        return this.thePrev;
    };

    this.setPrev = function (val) {
        this.thePrev = val;
    };

    this.next = function () {
        return this.theNext;
    };

    this.setNext = function (val) {
        this.theNext = val;
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
            link_val.linkMgrObject().freeLink(link_val);
        }, this.linkTimeoutInterval(), this);
        return time_out;
    };

    this.searchSessionBySessionId = function (session_id_val) {
        return this.sessionMgrObject().searchSessionBySessionId(session_id_val);
    };

    this.mallocSession = function () {
        return this.sessionMgrObject().mallocSession();
    };

    this.getPendingSessionData = function () {
        return this.sessionMgrObject().getPendingSessionData();
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

    this.init__(root_object_val, my_name_val, link_id_val);
}
