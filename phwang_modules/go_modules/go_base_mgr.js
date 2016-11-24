/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_base_mgr.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new GoBaseMgrClass(root_object_val);
    },
};

function GoBaseMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theGlobalBaseId = 100;
        this.theHead = null;
        this.theTail = null;
        this.theSize = 0;
        this.theNameListChanged = false;
        this.debug(true, "init__", "");
    };

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(this, my_name_val, link_id_val);
    };

    this.objectName = function () {
        return "GoBaseMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.globalBaseId = function () {
        return this.theGlobalBaseId;
    };

    this.incrementGlobalBaseId = function () {
        this.theGlobalBaseId += 1;
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

    this.mallocBase = function (root_object_val) {
        var base = require("../go_modules/go_base.js").malloc(root_object_val, this.globalBaseId());
        this.incrementGlobalBaseId();
        this.insertLinkToList(base);
        this.debug(true, "mallocBase", "base_id=" + base.baseId());
        return base.baseId();
    };

    this.transmitData = function (base_id_val) {
        var base = this.searchBaseByBaseId(base_id_val);
        if (!base) {
            return null;
        }
        return base.portObject().dequeueTransmitData();
    };

    this.freeLink = function (link_val) {
        this.deleteLinkFromList(link_val);
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
        if (this.size() <= 0) {
            this.abend("deleteLinkFromList", "size=" + this.size());
            return;
        }
        if (!this.linkExistInTheList(link_val)) {
            this.abend("deleteLinkFromList", "linkExistInTheList is false");
            return;
        }

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

    this.searchLinkByNameAndLinkId = function (my_name_val, link_id_val) {
        this.debug(false, "searchLinkByNameAndLinkId", my_name_val + " " + link_id_val);
        var link = this.head();
        while (link) {
            if ((link.linkId() === link_id_val) && (link.myName() === my_name_val)) {
                return link;
            }
            link = link.next();
        }
        return null;
    };
    
    this.searchBaseByBaseId = function (base_id_val) {
        this.debug(false, "searchBaseByBaseId", base_id_val);
        var base = this.head();
        while (base) {
            if (base.baseId() === base_id_val) {
                return base;
            }
            base = base.next();
        }
        return null;
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

    this.linkExistInTheList = function (link_val) {
        var link = this.head();
        while (link) {
            if (link === link_val) {
                return true;
            }
            link = link.next();
        }
        return false;
    };

    this.setNameListChanged = function () {
        var link = this.head();
        while (link) {
            link.setNameListChanged();
            link = link.next();
        }
    };

    this.getNameList = function () {
        var name_array = [];
        var i = 0;
        var link = this.head();
        while (link) {
            name_array[i] = link.myName();
            i += 1;
            link = link.next();
        }
        return name_array;
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
