/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: list_mgr.js
 */

module.exports = {
    malloc_mgr: function (host_object_val, global_id_val) {
        return new ListMgrClass(host_object_val, global_id_val);
    },

    malloc_joint: function (entry_id_val, entry_name_val) {
        return new ListjointClass(entry_id_val, entry_name_val);
    },

    head: function (list_mgr_val) {
        if (list_mgr_val === null) {
            return null;
        }
        return list_mgr_val.head();
    },

    next: function (host_object_val) {
        if (host_object_val === null) {
            return null;
        }
        if (host_object_val.jointObject().next() === null) {
            return null;
        }
        return host_object_val.jointObject().next().hostObject();
    },
};

function ListMgrClass(host_object_val, global_id_val) {
    "use strict";

    this.init__ = function (host_object_val, global_id_val) {
        this.theHostObject = host_object_val;
        this.theGlobalId = global_id_val;
        this.theHead = null;
        this.theTail = null;
        this.theSize = 0;
        this.debug(true, "init__", host_object_val.objectName());
    };

    this.objectName = function () {
        return "ListMgrClass";
    };

    this.hostObject = function () {
        return this.theHostObject;
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

    this.globalId = function () {
        return this.theGlobalId;
    };

    this.incrementGlobalId = function () {
        this.theGlobalId += 1;
    };

    this.allocId = function () {
        this.incrementGlobalId();
        return this.globalId();
    }

    this.insertEntry = function (link_val) {
        if (!link_val) {
            this.abend("insertEntry", "null link_val");
            return;
        }

        this.abendIt();

        this.incrementSize();
        if (!this.head()) {
            link_val.jointObject().setPrev(null);
            link_val.jointObject().setNext(null);
            this.setHead(link_val);
            this.setTail(link_val);
        } else {
            this.tail().jointObject().setNext(link_val);
            link_val.jointObject().setPrev(this.tail());
            link_val.jointObject().setNext(null);
            this.setTail(link_val);
        }
        this.abendIt();
    };

    this.deleteEntry = function (link_val) {
        if (this.size() <= 0) {
            this.abend("deleteEntry", "size=" + this.size());
            return;
        }
        if (!this.linkExistInTheList(link_val)) {
            this.abend("deleteEntry", "linkExistInTheList is false");
            return;
        }

        this.abendIt();
        if (link_val.jointObject().prev()) {
            link_val.jointObject().prev().jointObject().setNext(link_val.next());
        } else {
            this.setHead(link_val.jointObject().next());
        }
        if (link_val.jointObject().next()) {
            link_val.jointObject().next().setPrev(link_val.jointObject().prev());
        } else {
            this.setTail(link_val.jointObject().prev());
        }
        this.decrementSize();
        this.abendIt();
    };
    
    this.searchId = function (id_val) {
        this.debug(false, "searchId", "id=" + id_val);
        var entry = this.head();
        while (entry) {
            if (entry.jointObject().entryId() === id_val) {
                return entry;
            }
            entry = entry.jointObject().next();
        }
        return null;
    };

    this.searchIdName = function (id_val, name_val) {
        this.debug(false, "searchIdName", "id=" + id_val + " name=" + name_val);
        var entry = this.head();
        while (entry) {
            this.debug(false, "searchIdName", "entryId=" + entry.jointObject().entryId() + " entryName=" + entry.jointObject().entryName());
            if ((entry.jointObject().entryId() === id_val) && (entry.jointObject().entryName() === name_val)) {
                return entry;
            }
            entry = entry.jointObject().next();
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
            link = link.jointObject().next();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "head: size=" + this.size() + " i=" + i);
        }

        i = 0;
        link = this.tail();
        while (link) {
            link = link.jointObject().prev();
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
        this.LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        require("../util_modules/logit.js").LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        require("../util_modules/logit.js").ABEND(str1_val, str2_val);
    };

    this.init__(host_object_val, global_id_val);
}

function ListjointClass(entry_id_val, entry_name_val) {
    "use strict";

    this.init__ = function (entry_id_val, entry_name_val) {
        this.theEntryId = entry_id_val;
        this.theEntryName = entry_name_val;
        this.thePrev = null;
        this.theNext = null;
    };

    this.entryId = function () {
        return this.theEntryId;
    };

    this.entryName = function () {
        return this.theEntryName;
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

    this.init__(entry_id_val, entry_name_val);
};
