/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fibre_ajax.js
 */

var the_fabric_ajax_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (the_fabric_ajax_object) {
            return;
        }
        the_fabric_ajax_object = new FabricAjaxClass(root_object_val);
        return the_fabric_ajax_object;
    },

    post: function (req, res) {
        the_fabric_ajax_object.processPost(req, res);
    },

    get: function (req, res) {
        the_fabric_ajax_object.processGet(req, res);
    },

    not_found: function (req, res) {
        the_fabric_ajax_object.processNotFound(req, res);
    },

    failure: function (req, res) {
        the_fabric_ajax_object.processFailure(err, req, res, next);
    },
};

function FabricAjaxClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theSwitchObject = this.importObject().importSwitch().malloc(this.rootObject());
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricAjaxClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.switchObject = function () {
        return this.theSwitchObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.utilObject = function () {
        return this.utilObject().utilObject();
    };

    this.processGet = function (req, res) {
        if (!req.headers.gorequest) {
            this.abend("processGet", "null gorequest");
            return;
        }

        this.debug(false, "processGet", "gorequest=" + req.headers.gorequest);

        var go_request = JSON.parse(req.headers.gorequest);
        if (!go_request) {
            this.abend("processGet", "null go_request");
            return;
        }

        if ((go_request.command !== "keep_alive") &&
            (go_request.command !== "get_name_list") &&
            (go_request.command !== "get_session_data")) {
            this.debug(false, "processGet", "command=" + go_request.command);
        }

        var data = this.switchObject().switchRequest(req.headers.gorequest);
        var json_str = JSON.stringify({
                        command: go_request.command,
                        data: data,
                    });
        res.type('application/json');
        res.send(json_str);
    };

    this.processPost = function (req, res) {
        this.abend("processPost", "not implemented yet");
    };

    this.processNotFound = function (req, res) {
        console.log(req.headers);
        this.debug(true, "processNotFound", "*****");
        res.type('text/plain');
        res.status(404);
        res.send('Not Found');
    };

    this.processFailure = function (err, req, res, next) {
        this.logit("processFailure", state);
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
