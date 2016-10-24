/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fibre_module.js
 */

module.exports = {
    malloc: function (port_object_val) {
        return new AjaxObject(port_object_val);
    },
};

function AjaxObject(port_object_val) {
    "use strict";
    this.thePortObject = port_object_val;

    this.objectName = function () {
        return "AjaxObject";
    };

    this.portObject = function () {
        return this.thePortObject;
    };

    this.rootObject = function () {
        return this.portObject().rootObject();
    };

    this.fabricObject = function () {
        return this.rootObject().fabricObject();
    };

    this.switchObject = function () {
        return this.fabricObject().switchObject();
    };

    this.utilObject = function () {
        return this.utilObject().utilObject();
    };

    this.processGet = function (req, res) {
        if (!req.headers.gorequest) {
            this.abend("processGet", "null gorequest");
            return;
        }

        this.debug(false, "processGet", "req.headers.gorequest=" + req.headers.gorequest);

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

        var data = this.switchObject().switchRequest(go_request);
        var json_str = JSON.stringify({
                        command: go_request.command,
                        ajax_id: go_request.ajax_id,
                        data: data,
                    });
        res.type('application/json');
        res.send(json_str);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.portObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.portObject().abend(this.objectName() + "." + str1_val, str2_val);
    };
}
