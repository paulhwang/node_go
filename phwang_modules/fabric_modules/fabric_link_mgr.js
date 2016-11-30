/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_dlink.js
 */

var the_fabric_link_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_fabric_link_mgr_object) {
            the_fabric_link_mgr_object = new FabricLinkMgrClass(root_object_val);
        }
        return the_fabric_link_mgr_object;
    },
};

function FabricLinkMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theLinkListObject = this.importObject().importListMgr().malloc_mgr(this, 0);
        this.theNameListChanged = false;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricLinkMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkListObject = function () {
        return this.theLinkListObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.mallocLink = function (my_name_val) {
        var link = this.rootObject().importObject().importLink().malloc(this.rootObject(), my_name_val, this.linkListObject().allocId());
        this.linkListObject().insertEntry(link);
        this.setNameListChanged();
        return link;
    };

    this.freeLink = function (link_val) {
        this.deleteLinkFromList(link_val);
    };

    this.setNameListChanged = function () {
        var link = this.linkListObject().head();
        while (link) {
            link.setNameListChanged();
            link = link.next();
        }
    };

    this.getNameList = function () {
        var name_array = [];
        var i = 0;
        var link = this.linkListObject().head();
        while (link) {
            name_array[i] = link.myName();
            i += 1;
            link = link.next();
        }
        return name_array;
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

    this.init__(root_object_val);
}

