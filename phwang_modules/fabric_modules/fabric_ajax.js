/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fibre_ajax.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new FabricAjaxClass(root_object_val);
    },
};

function FabricAjaxClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricAjaxClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.switchObject = function () {
        return this.rootObject().switchObject();
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
