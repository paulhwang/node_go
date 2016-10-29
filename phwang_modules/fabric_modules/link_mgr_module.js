/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_module.js
 */

module.exports = {
    malloc: function (fabric_val) {
        return new LinkMgrObject(fabric_val);
    },
};

function LinkMgrObject(fabric_val) {
    "use strict";
    this.theFabricObject = fabric_val;

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(this, my_name_val, link_id_val);
    };

    this.objectName = function () {
        return "LinkMgrObject";
    };

    this.fabricObject = function () {
        return this.theFabricObject;
    };

    this.rootObject = function () {
        return this.fabricObject().rootObject();
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
        this.theGlobalLinkId += 1;
    };

    this.insertLinkToList = function (link_val) {
        if (!link_val) {
            this.abend("insertLinkToList", "null link_val");
            return;
        }

        this.abendIt();

        this.incrementSize();
        if (!this.head()) {
            link_val.setPrev(null);
            link_val.setNext(null);
            this.setHead(link_val);
            this.setTail(link_val);
        } else {
            this.tail().setNext(link_val);
            link_val.setPrev(this.tail());
            link_val.setNext(null);
            this.setTail(link_val);
        }
        this.abendIt();
    };

    this.deleteLinkFromList = function (link_val) {
        this.abendIt();
        if (link_val.prev()) {
            link_val.prev().setNext(link_val.next());
        } else {
            this.setHead(link_val.next());
        }
        if (link_val.next()) {
            link_val.next().setPrev(link_val.prev());
        } else {
            this.setTail(link_val.prev());
        }
        this.decrementSize();
        this.abendIt();
    };

    this.searchLinkByName = function (my_name_val) {
        this.debug(false, "searchLinkByName", "name=" + my_name_val);
        return this.linkQueue().searchIt(function (link_val, my_name_val) {
            return my_name_val === link_val.myName()
        }, my_name_val);
    };

    this.searchLinkByLinkId = function (link_id_val) {
        this.debug(false, "searchLinkByLinkId", "link_id=" + link_id_val);
        return this.linkQueue().searchIt(function (link_val, link_id_val) {
            return link_id_val === link_val.linkId()
        }, link_id_val);
    };

    this.searchLinkByNameAndLinkId = function (my_name_val, link_id_val) {
        this.debug(false, "searchLinkByNameAndLinkId", my_name_val + " " + link_id_val);
        return this.linkQueue().searchIt(function (link_val, my_name_val, link_id_val) {
            return ((my_name_val === link_val.myName()) &&
                    ((link_id_val === link_val.linkId()) || (link_id_val === 0)));
        }, my_name_val, link_id_val);
    };

    this.searchAndCreate = function (my_name_val) {
        var link = this.searchLinkByName(my_name_val);
        if (!link) {
            link = this.mallocLink(my_name_val);
            this.debug(false, "searchAndCreate", "malloc link: name=" + link.myName() + "=link_id=" + link.link_id);
            this.setNameListChanged();
            this.linkQueue().enQueue(link);
        }
        return link;
    };

    this.removeLink = function (link_val) {
        this.logit("removeLink", "my_name=" + link_val.myName() + " link_id=" + link_val.linkId());
        this.linkQueue().unQueue(function (link_val, my_name_val, link_id_val) {
            return ((my_name_val === link_val.myName()) && (link_id_val === link_val.linkId()));
        }, link_val.myName(), link_val.linkId());
        this.setNameListChanged();
    };

    this.setNameListChanged = function () {
        var queue_element = this.linkQueue().tail();
        while (queue_element) {
            var link = queue_element.data();
            link.setNameListChanged();
            queue_element = queue_element.prev();
        }
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
        var entry = this.linkModuleMalloc(my_name_val, this.globalLinkId());
        this.incrementGlobalLinkId();
        return entry;
    };

    this.freeLink = function (link_val) {
    };

    this.abendIt = function () {
        var i = 0;
        var link = this.head();
        while (link) {
            link = link.next();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "head: size=" + this.size() + " i=" + i);
        }

        i = 0;
        link = this.tail();
        while (link) {
            link = link.prev();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "tail: size=" + this.size() + " i=" + i);
        }
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
    this.theNameListChanged = false;
}
