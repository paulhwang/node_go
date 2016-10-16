/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_module.js
 */

module.exports = {
    malloc: function (fibre_val) {
        return new LinkMgrObject(fibre_val);
    },
};

function LinkMgrObject(fibre_val) {
    "use strict";
    this.theFibreObject = fibre_val;

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(this, my_name_val, link_id_val);
    };

    this.objectName = function () {
        return "LinkMgrObject";
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

    this.linkQueue = function () {
        return this.theLinkQueue;
    };

    this.poolQueue = function () {
        return this.thePoolQueue;
    };

    this.globalLinkId = function () {
        return this.theGlobalLinkId;
    };

    this.incrementGlobalLinkId = function () {
        return this.theGlobalLinkId += 1;
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
            link = this.mallocLink(my_name_val);
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

    this.mallocLink = function (my_name_val) {
        var entry = this.poolQueue().deQueue();
        if (!entry) {
            entry = this.linkModuleMalloc(my_name_val, this.globalLinkId());
        } else {
            entry.resetIt(my_name_val, this.globalLinkId());
        }
        this.incrementGlobalLinkId();
        return entry;
    };

    this.freeLink = function (link_val) {
        this.poolQueue().enQueue(link_val);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theGlobalLinkId = 10;
    this.theLinkQueue = this.utilObject().mallocQueue();
    this.thePoolQueue = this.utilObject().mallocQueue();
}
