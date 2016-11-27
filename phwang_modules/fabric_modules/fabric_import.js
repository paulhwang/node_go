/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: import.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new ImportObject(root_object_val);
    },
};

function ImportObject (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importBase = function () {
        return require("./fabric_base.js");
    }

    this.importUlink = function () {
        return require("./fabric_ulink.js");
    }

    this.importDlink = function () {
        return require("./fabric_dlink.js");
    }

    this.importSwitch = function () {
        return require("./fabric_switch.js");
    };

    this.importAjax = function () {
        return require("./fabric_ajax.js");
    };

    this.importLink = function () {
        return require("./fabric_link.js");
    }

    this.importSession = function () {
        return require("./fabric_session.js");
    }

    this.importListMgr = function () {
        return require("../util_modules/list_mgr.js");
    };

    this.importLogit = function () {
        return require("../util_modules/logit.js");
    }

    this.mallocQueue = function () {
        return require("../util_modules/queue.js").malloc(this.rootObject());
    };

    this.mallocRing = function () {
        return require("../util_modules/ring.js").malloc(this.rootObject());
    };

    this.init__(root_object_val);
};
