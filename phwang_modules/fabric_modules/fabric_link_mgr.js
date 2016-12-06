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
        this.theLinkIndexArray = [0];
        this.theLinkTableArray = [null];
        this.theLinkListObject = this.importListMgr().malloc_mgr(this, 0);
        this.theNameListChanged = false;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricLinkMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkIndexArray = function () {
        return this.theLinkIndexArray;
    };

    this.linkTableArray = function () {
        return this.theLinkTableArray;
    };

    this.linkListObject = function () {
        return this.theLinkListObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.linkIndexArrayLength = function () {
        return this.linkIndexArray().length;
    };

    this.mallocLink = function (my_name_val) {
        var link = this.importObject().importLink().malloc(this.rootObject(), this.linkListObject().allocId(), my_name_val);
        this.linkIndexArray().push(link.linkId());
        this.linkTableArray().push(link);
        this.setNameListChanged();
        return link;
    };

    this.getLinkByIdName = function (link_id_val, link_name_val) {
        var index = this.linkIndexArray().indexOf(link_id_val);
        if (index === -1) {
            return null;
        } else {
            var link =this.linkTableArray()[index];
            return link;
        }
    };

    this.getLinkById = function (link_id_val) {
        var index = this.linkIndexArray().indexOf(link_id_val);
        if (index === -1) {
            return null;
        } else {
            var link =this.linkTableArray()[index];
            return link;
        }
    };

    this.unQueueLink = function (link_val) {
        this.linkListObject().unQueue(link_val);
    };

    this.searchId = function (id_val) {
        return this.linkListObject().searchId(id_val);
    }

    this.searchName = function (name_val) {
        return this.linkListObject().searchName(name_val);
    }

    this.searchIdName = function (id_val, name_val) {
        return this.linkListObject().searchIdName(id_val, name_val);
    }

    this.setNameListChanged = function () {
        var i = this.linkIndexArrayLength() - 1;
        while (i > 0) {
            var link = this.linkTableArray()[i];
            if (link) {
                link.setNameListChanged();
            }
            i -= 1;
        }
    };

    this.getNameList = function () {
        var name_array = [];
        var j = 0;
        var i = this.linkIndexArrayLength() - 1;
        while (i > 0) {
            var link = this.linkTableArray()[i];
            if (link) {
                name_array[j] = link.myName();
                j += 1;
            }
            i -= 1;
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

