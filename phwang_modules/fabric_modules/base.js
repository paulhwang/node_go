/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: base.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new BaseObject(root_object_val);
    },
};

function BaseObject(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theGlobalLinkId = 10;
        this.theNameListChanged = false;
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "BaseObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkMgrObject = function () {
        return this.rootObject().linkMgrObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.globalLinkId = function () {
        return this.theGlobalLinkId;
    };

    this.incrementGlobalLinkId = function () {
        this.theGlobalLinkId += 1;
    };

    this.mallocLink = function (my_name_val) {
        var link = this.rootObject().importObject().importLink().malloc(this.rootObject(), my_name_val, this.globalLinkId());
        this.incrementGlobalLinkId();
        this.linkMgrObject().insertEntry(link);
        this.setNameListChanged();
        return link;
    };

    this.freeLink = function (link_val) {
        this.deleteLinkFromList(link_val);
    };

    this.searchLinkByName = function (my_name_val) {
        this.debug(false, "searchLinkByName", my_name_val);
        var link = this.head();
        while (link) {
            if (link.myName() === my_name_val) {
                return link;
            }
            link = link.next();
        }
        return null;
    };

    this.setNameListChanged = function () {
        var link = this.linkMgrObject().head();
        while (link) {
            link.setNameListChanged();
            link = link.next();
        }
    };

    this.getNameList = function () {
        var name_array = [];
        var i = 0;
        var link = this.linkMgrObject().head();
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
