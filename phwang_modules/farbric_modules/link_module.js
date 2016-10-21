/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_module.js
 */

module.exports = {
    malloc: function (link_mgr_val, my_name_val, link_id_val) {
        return new LinkObject(link_mgr_val, my_name_val, link_id_val);
    },
};

function LinkObject(link_mgr_val, my_name_val, link_id_val) {
    "use strict";
    this.theLinkMgrObject  = link_mgr_val;
    this.theKeepAliveTimer = null;

    this.objectName = function () {
        return "LinkObject";
    };

    this.linkMgrObject = function () {
        return this.theLinkMgrObject;
    };

    this.FibreObject = function () {
        return this.linkMgrObject().FibreObject();
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

    this.nameListChanged = function () {
        return this.theNameListChanged;
    };

    this.setNameListChanged = function () {
        this.theNameListChanged = true;
    };

    this.clearNameListChanged = function () {
        this.theNameListChanged = false;
    };

    this.resetIt = function (my_name_val, link_id_val) {
        this.theLinkId = link_id_val;
        this.theMyName = my_name_val;
        this.up_seq = 0;
        this.down_seq = 0;
        this.theReceiveQueue = this.utilObject().mallocQueue();
        this.theReceiveRing = this.utilObject().mallocRing();
        this.theKeepAliveTimer = this.resetTimeout();
    };

    this.resetKeepAliveTimer = function () {
        this.debug(false, "keepAlive", "my_name=" + this.my_name + " link_id=" + this.link_id);
        this.setKeepAliveTimer(this.resetTimeout());
    };

    this.resetTimeout = function () {
        if (this.keepAliveTimer()) {
            clearInterval(this.keepAliveTimer());
        }
        this.debug(false, "resetTimeout", "my_name=" + this.my_name + " link_id=" + this.link_id);
        var time_out = setInterval(function (link_val) {
            console.log("resetTimeout(***timeout occurs)", "my_name=" + link_val.myName() + " link_id=" + link_val.linkId());
            clearInterval(link_val.keepAliveTimer());
            link_val.linkMgrObject().freeLink(link_val);
        }, 20000, this);
        return time_out;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.linkMgrObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.linkMgrObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.resetIt(my_name_val, link_id_val);
}
