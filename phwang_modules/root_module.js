/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

module.exports = {
    get_root: function () {
        return the_root;
    },

    LOG_IT: function (str1_val, str2_val) {
        LOG_IT_(str1_val, str2_val);
    },

    ABEND: function (str1_val, str2_val) {
        ABEND_(str1_val, str2_val);
    },
};

var LOG_IT_ = function(str1_val, str2_val) {
    if (str1_val === undefined) {
        str1_val = "UNDEFINED";
    }
    if (str1_val === null) {
        str1_val = "NULL";
    }
    if (str2_val === undefined) {
        str2_val = "UNDEFINED";
    }
    if (str2_val === null) {
        str2_val = "NULL";
    }
    console.log(str1_val + "() " + str2_val);
};

var ABEND_ = function(str1_val, str2_val) {
    if (str1_val === undefined) {
        str1_val = "UNDEFINED";
    }
    if (str1_val === null) {
        str1_val = "NULL";
    }
    if (str2_val === undefined) {
        str2_val = "UNDEFINED";
    }
    if (str2_val === null) {
        str2_val = "NULL";
    }
    console.log("***ABEND*** " + str1_val + "() " + str2_val);
    this.doCrash();
};

var the_root = new RootObject();

function RootObject () {
    "use strict";

    this.init__ = function () {
        this.theFabricObject = require("./fabric_modules/fabric_module.js").malloc(this);
        this.theAjaxObject = require("./port_modules/ajax_module.js").malloc(this);
    };

    this.objectName = function () {
        return "RootObject";
    };

    this.fabricObject = function () {
        return this.theFabricObject;
    };

    this.ajaxObject = function () {
        return this.theAjaxObject;
    };

    this.linkMgrObject = function () {
        return this.farbricObject().linkMgrObject();
    };

    this.sessionMgrObject = function () {
        return this.farbricObject().sessionMgrObject();
    };

    this.clusterMgrObject = function () {
        return this.farbricObject().clusterMgrObject();
    };

    this.mallocQueue = function () {
        return require("./util_modules/queue_module.js").malloc(this);
    };

    this.mallocRing = function () {
        return require("./util_modules/ring_module.js").malloc(this);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        if (str1_val === undefined) {
            str1_val = "UNDEFINED";
        }
        if (str1_val === null) {
            str1_val = "NULL";
        }
        if (str2_val === undefined) {
            str2_val = "UNDEFINED";
        }
        if (str2_val === null) {
            str2_val = "NULL";
        }
        console.log(str1_val + "() " + str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        if (str1_val === undefined) {
            str1_val = "UNDEFINED";
        }
        if (str1_val === null) {
            str1_val = "NULL";
        }
        if (str2_val === undefined) {
            str2_val = "UNDEFINED";
        }
        if (str2_val === null) {
            str2_val = "NULL";
        }
        console.log("***ABEND*** " + str1_val + "() " + str2_val);
        this.doCrash();
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        require("../util_modules/util_module.js").LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        require("../util_modules/util_module.js").ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__();
};
