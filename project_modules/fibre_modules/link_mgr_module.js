/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_module.js
 */

var theLinkMgrObject;

module.exports = {
    malloc: function (root_object_val) {
        return new LinkMgrObject(root_object_val);
    },
};

function LinkMgrObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_entry_module.js");
        return link_module.malloc(my_name_val, link_id_val);
    };

    this.queueModule = function () {
        return this.rootObject().queueModule();
    };

    this.objectName = function () {
        return "LinkMgrObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.linkQueue = function () {
        return this.theLinkQueue;
    };

    this.globalLinkId = function () {
        return this.theGlobalLinkId;
    };

    this.incrementGlobalLinkId = function () {
        return this.theGlobalLinkId += 1;
    };

    this.poolHead = function () {
        return this.thePoolHead;
    };

    this.setPoolHead = function (val) {
        this.thePoolHead = val;
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

    this.searchLink = function (my_name_val, link_id_val) {
        this.debug(false, "searchIt", my_name_val + " " + link_id_val);
        return this.linkQueue().searchIt(function (link_val, my_name_val, link_id_val) {
            return ((my_name_val === link_val.myName()) &&
                    ((link_id_val === link_val.linkId()) || (link_id_val === 0)));
        }, my_name_val, link_id_val);
    };

    this.searchAndCreate = function (my_name_val, link_id_val) {
        var link = this.searchLink(my_name_val, link_id_val);
        if (!link) {
            link = this.mallocIt(my_name_val);
            this.debug(false, "searchAndCreate", "malloc link: name=" + link.myName() + "=link_id=" + link.link_id);
            this.linkQueue().enQueue(link);
        }
        return link;
    };

    this.removeLink = function (link_val) {
        this.logit("removeLink", "my_name=" + link_val.myName() + " link_id=" + link_val.linkId());
        this.linkQueue().unQueue(function (link_val, my_name_val, link_id_val) {
            return ((my_name_val === link_val.myName()) && (link_id_val === link_val.linkId()));
        }, link_val.myName(), link_val.linkId());
    };

    this.getNameList = function () {
        var name_array = [];
        var i = 0;
        var queue_element = this.linkQueue().tail();
        while (queue_element) {
            var link = queue_element.data();
            name_array[i] = link.myName();
            i += 1;
            queue_element = queue_element.prev();
        }
        return name_array;
    };

    this.mallocIt = function (my_name_val) {
        var entry;
        if (!this.poolHead()) {
            entry = this.linkModuleMalloc(my_name_val, this.globalLinkId());
        } else {
            entry = this.poolHead();
            entry.resetIt(my_name_val, this.globalLinkId());
            this.setHead(entry.next());
            this.decrementPoolSize();
        }
        this.incrementGlobalLinkId();

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
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theGlobalLinkId = 10;
    this.thePoolHead = null;
    this.thePoolSize = 0;
    this.theLinkQueue = this.queueModule().malloc();
}
