/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new QueueClass(root_object_val);
    },
};

function QueueClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theListObject = require("./list_mgr.js").malloc_mgr(this, 0);
        this.theHead = null;
        this.theTail = null;
        this.theSize = 0;
        this.debug(true, "init__", this.rootObject().objectName());
        if (this.debugRing()) {
            this.theRingObject = this.rootObject().importObject().mallocRing();
        }
        this.debug(true, "init__", "");
    };

    this.debugMe = function () {
        return true;
    };

    this.debugRing = function () {
        return false;
    };

    this.objectName = function () {
        return "QueueClass";
    };

    this.holderEntryModule = function () {
        return require("./holder_entry_module.js");
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.ringObject = function () {
        return this.theRingObject;
    }

    this.listObject = function () {
        return this.theListObject;
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

    this.enQueue = function (data_val) {
        if (!data_val) {
            this.abend("enQueue", "null data_val");
            return;
        }

        if (this.debugRing()) {
            var i = 10
            while (i > 0) {
                this.ringObject().enQueue(data_val);
                i -= 1;
            }
        }

        this.abendIt();

        var data_entry = new HolderEntryClass(this, this.listObject().allocId());
        if (!data_entry) {
            this.abend("enQueue", "null data_entry");
            return;
        }
        data_entry.setData(data_val);
        this.listObject().enQueue(data_entry);
        return;

        this.incrementSize();
        if (!this.head()) {
            data_entry.setPrev(null);
            data_entry.setNext(null);
            this.setHead(data_entry);
            this.setTail(data_entry);
        } else {
            this.tail().setNext(data_entry);
            data_entry.setPrev(this.tail());
            data_entry.setNext(null);
            this.setTail(data_entry);
        }
        this.abendIt();
    };

    this.deQueue = function () {
        var data_entry;
        var data;

        data_entry = this.listObject().deQueue();
        if (!data_entry) {
            this.debug(false, "deQueue", "empty: " + this.rootObject().objectName());
            return null;
        }
        return data_entry.data();

        this.abendIt();

        if (!this.head()) {
            data_entry = null;
            data = null;
        } else if (this.head() === this.tail()) {
            this.decrementSize();
            data_entry = this.head();
            data = data_entry.data();
            this.setHead(null);
            this.setTail(null);
        } else {
            this.decrementSize();
            data_entry = this.head();
            data = data_entry.data();
            this.setHead(this.head().next());
            this.head().setPrev(null);
        }

        this.abendIt();


        if (data && this.debugRing()) {
            var i = 10
            while (i > 0) {
                var data1 = this.ringObject().deQueue();
                if (!data1) {
                    this.abend("deQueue", "null");
                }
                if (data != data1) {
                    this.abend("deQueue", "ring not match");
                }
                i -= 1;
            }
        }

        return data;
    };

    this.unQueue = function (func_val, input_val1, input_val2, input_val3) {
        this.abendIt();

        var p = this.head();
        while (p) {
            this.debug(false, "unQueue", "in while loop");
            if (func_val(p.data(), input_val1, input_val2, input_val3)) {
                this.debug(false, "unQueue", "found");
                if (p.prev()) {
                    p.prev().setNext(p.next());
                } else {
                    this.setHead(p.next());
                }
                if (p.next()) {
                    p.next().setPrev(p.prev());
                } else {
                    this.setTail(p.prev());
                }
                this.decrementSize();
                return p;
            }
            p = p.next();
        }
        this.abendIt();
        this.debug(false, "unQueue", "not found");
    };

    this.searchIt = function (func_val, input_val1, input_val2, input_val3) {
        var p = this.head();
        while (p) {
            this.debug(false, "searchIt", "in while loop");
            if (func_val(p.data(), input_val1, input_val2, input_val3)) {
            this.debug(false, "searchIt", "found");
                return p.data();
            }
            p = p.next();
        }
        this.debug(false, "searchIt", "not found");
        return null;
    };

    this.abendIt = function () {
        if (!this.debugMe()) {
            return;
        }

        var i = 0;
        var p = this.head();
        while (p) {
            p = p.next();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "head: size=" + this.size() + " i=" + i);
        }

        i = 0;
        p = this.tail();
        while (p) {
            p = p.prev();
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

function HolderEntryClass(queue_object_val, holder_id_val) {
    "use strict";

    this.init__ = function (queue_object_val, holder_id_val) {
        this.theQueueObject = queue_object_val;
        this.theJointObject = require("./list_mgr.js").malloc_joint(holder_id_val);
        this.theData = null;
        this.thePrev = null;
        this.theNext = null;
        this.debug(true, "init__", "holderId=" + this.queueObject().rootObject().objectName() + ":" + this.holderId());
    };

    this.objectName = function () {
        return "HolderEntryClass";
    };

    this.queueObject = function () {
        return this.theQueueObject;
    };

    this.rootObject = function () {
        return this.queueObject().rootObject();
    };

    this.jointObject = function () {
        return this.theJointObject;
    };

    this.data = function () {
        return this.theData;
    };

    this.setData = function (val) {
        this.theData = val;
    };

    this.holderId = function () {
        return this.jointObject().entryId();
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

    this.init__(queue_object_val, holder_id_val);
}
