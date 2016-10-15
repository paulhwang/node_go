/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: express_http_module.js
 */

//var util = require("./util_module.js");
var root = require("./project_modules/root_module.js");
var queue = require("./project_modules/util_modules/queue_module.js");
var link_entry = require("./project_modules/fibre_modules/link_module.js");
var express = require('express');
var bodyParser = require('body-parser');
var state;

var theExpressHttpObject = new ExpressHttpObject(root.malloc());

module.exports = {
    post: function (req, res) {
        theExpressHttpObject.processPost(req, res);
    },
    
    get: function (req, res) {
        theExpressHttpObject.processGet(req, res);
    },

    not_found: function (req, res) {
        theExpressHttpObject.processNotFound(req, res);
    },
    
    failure: function (req, res) {
        theExpressHttpObject.processFailure(err, req, res, next);
    },
};

function ExpressHttpObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "ExpressHttpObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.linkMgrObject = function () {
        return this.rootObject().linkMgrObject();
    };

    this.sessionMgrObject = function () {
        return this.rootObject().sessionMgrObject();
    };

    this.getLink = function (go_request) {
        var link_id = Number(go_request.link_id);
        var link = this.linkMgrObject().searchLink(go_request.my_name, link_id);
        if (!link) {
            //res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            this.abend("getLink", "null link" + "link_id=" + link_id + " my_name=" + go_request.my_name);
            return null;
        }
        if (link.link_id === 0) {
            //res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            this.abend("getLink", "link_id = 0");
            return null;
        }
        return link;
    };

    this.processPost = function (req, res) {
        var my_link_id, my_session, his_session;

        this.debug(false, "processPost", "start");
        this.debug(false, "processPost", "my_name=" + req.body.my_name + " link_id=" + req.body.link_id);
        state = "processPost start";

        my_link_id = Number(req.body.link_id);
        my_link = this.linkMgrObject().search(req.body.my_name, my_link_id);
        if (!my_link) {
            this.abend("processPost", "null my_link");
            return;
        }
        if (my_link.link_id === 0) {
            this.abend("processPost", "null my_link = 0");
            return;
        }

        var my_session_id = Number(req.body.session_id);
        my_session = this.sessionMgrObject().search(req.body.my_name, req.body.his_name, my_session_id);
        if (!my_session) {
            this.abend("processPost", "null my_session");
            return;
        }
        if (my_session.session_id === 0) {
            this.abend("processPost", "null my_session = 0");
            return;
        }

        this.logit("processPost", "(" + req.body.link_id + "," + req.body.session_id + ") "  + req.body.my_name + "=>" + req.body.his_name + " {" + req.body.data + "} " + req.body.xmt_seq + "=>" + my_session.up_seq);

        if (req.body.my_name === req.body.his_name) {
            his_session = my_session;
        } else {
            his_session = this.sessionMgrObject().search(req.body.my_name, req.body.his_name, -1);
            if (!his_session) {
                this.abend("processPost", "null his_session");
                return;
            }
            if (his_session.session_id === 0) {
                this.abend("processPost", "null his_session = 0");
                return;
            }
        }

        if (req.body.xmt_seq === my_session.up_seq) {
            queue.enqueue(his_session.receiveQueue(), req.body.data);
            ring.enqueue(his_session.receiveRing(), req.body.data);
            my_session.up_seq += 1;
        } else if (req.body.xmt_seq < my_session.up_seq) {
            if (req.body.xmt_seq === 0) {
                queue.enqueue(his_session.queue, req.body.data);
                ring.enqueue(his_session.ring, req.body.data);
                my_session.up_seq = 1;
                this.logit("processPost", req.body.data + " post " + req.body.xmt_seq + " reset");
            } else {
                this.logit("processPost", "(" + req.body.link_id + "," + req.body.session_id + ") "  + req.body.my_name + "=>" + req.body.his_name + " {" + req.body.data + "} " + req.body.xmt_seq + " dropped");
            }
        } else {
            this.logit("***abend: processPost", req.body.data + " post seq=" + req.body.xmt_seq + " dropped");
        }
        state = "processPost end";
        this.debug(false, "processPost", "end");
    };

    this.processGet = function (req, res) {
        if (!req.headers.gorequest) {
            this.abend(false, "processGet", "null gorequest");
            return;
        }

        var go_request = JSON.parse(req.headers.gorequest);
        if (!go_request) {
            this.abend(false, "processGet", "null go_request");
            return;
        }

        if ((go_request.command !== "keep_alive") &&
            (go_request.command !== "get_name_list") &&
            (go_request.command !== "get_session_data")) {
            this.debug(false, "processGet", "command=" + go_request.command);
        }

        var data = this.rootObject().fibreObject().dispatchObject().dispatchRequest(go_request);
        this.sendResponse(res, go_request, data);
    };

    this.sendResponse = function (res, go_request, data_val) {
        var json_str = JSON.stringify({
                        command: go_request.command,
                        ajax_id: go_request.ajax_id,
                        data: data_val,
                        res_data: data_val,
                    });
        res.type('application/json');
        res.send(json_str);
    }

    this.jsonStingifyData = function (command_val, ajax_id_val, data_val) {
        var json_str = JSON.stringify({
                        command: command_val,
                        ajax_id: ajax_id_val,
                        data: data_val,
                    });
        return json_str;
    };

    this.processNotFound = function (res) {
        console.log(req.headers);
        this.logit("processNotFound", "*****");
        res.type('text/plain');
        res.status(404);
        res.send('Not Found');
    };

    this.processFailure = function (err, req, res, next) {
        this.logit("processFailure", state);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };
}
