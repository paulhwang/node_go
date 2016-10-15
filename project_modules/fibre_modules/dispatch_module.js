/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: dispatch_module.js
 */

module.exports = {
    malloc: function (fibre_val) {
        return new DispatchObject(fibre_val);
    },
};

function DispatchObject(fibre_val) {
    "use strict";
    this.theFibreObject = fibre_val;

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(this, my_name_val, link_id_val);
    };

    this.objectName = function () {
        return "DispatchObject";
    };

    this.fibreObject = function () {
        return this.theFibreObject;
    };

    this.rootObject = function () {
        return this.fibreObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.linkMgrObject = function () {
        return this.fibreObject().linkMgrObject();
    };

    this.sessionMgrObject = function () {
        return this.fibreObject().sessionMgrObject();
    };

    this.dispatchRequest = function (go_request) {
        this.debug(false, "dispatchRequest", "command=" + go_request.command);

        if (go_request.command === "setup_link") {
            return this.setupLink(go_request);
        }

        if (go_request.command === "keep_alive") {
            this.abend("dispatchRequest", "keep_alive gorequest=");
            return this.keepAlive(go_request);
        }

        if (go_request.command === "get_link_data") {
            return this.getLinkData(go_request);
        }

        if (go_request.command === "put_link_data") {
            this.abend("dispatchRequest", "put_link_data");
            return this.putLinkData(go_request);
        }

        if (go_request.command === "get_name_list") {
            return this.getNameList(go_request);
        }

        if (go_request.command === "setup_session") {
            return this.setupSession(go_request);
        }

        if (go_request.command === "get_session_data") {
            return this.getSessionData(go_request);
        }

        if (go_request.command === "put_session_data") {
            return this.putSessionData(go_request);
        }

         this.abend("dispatchRequest", "command=" + go_request.command);
    }

    this.setupLink = function (go_request) {
        if (!go_request) {
            this.abend("setupLink", "null go_request");
            return null;
        }

        var link = this.linkMgrObject().searchAndCreate(go_request.my_name, 0);
        if (!link) {
            res.send(this.jsonStingifyData(req.headers.command, go_request.ajax_id, null));
            this.abend("setupLink", "null link");
            return null;
        } else {
            link.resetKeepAliveTimer();
        }

        var link_id_str = "" + link.linkId();
        this.logit("setupLink", "name=" + go_request.my_name + " link_id=" + link.linkId());
        return link_id_str;
    };

    this.getLinkData = function (go_request) {
        this.debug(false, "getLinkData", "link_id=" + go_request.link_id + " my_name=" + go_request.my_name + " ajax_id=" + go_request.ajax_id);

        var link = this.getLink(go_request);
        if (!link) {
            return null;
        }
        link.resetKeepAliveTimer();

        var data = link.receiveQueue().deQueue();
        if (data) {
            this.logit("getLinkData", "link_id=" + go_request.link_id + " my_name="  + go_request.my_name + " data={" + data + "}");
        }
        return data;
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

    this.putLinkData111111111 = function (res, go_request) {
        this.debug(true, "putLinkData", "link_id=" + go_request.link_id + " my_name=" + go_request.my_name + " data=" + go_request.data);

        var my_link = this.getLink(res, go_request);
        if (!my_link) {
            return null;
        }
        my_link.resetKeepAliveTimer();

        if (data.order === "setup_session_reply") {
            var data_str = this.sessionMgrObject().preSessionQueue().unQueue(function(data_val, param_val1) {
                return (data_val === param_val1);
            }, go_request.data);
            if (data_str) {
                var data = JSON.parse(go_request.data);
            }

        }
        return data;
    };

    this.getNameList = function (go_request) {
        var link = this.getLink(go_request);
        if (!link) {
            return null;
        }
        link.resetKeepAliveTimer();

        var name_array = this.linkMgrObject().getNameList();
        var name_array_str = JSON.stringify(name_array);
        this.debug(true, "getNameList", "(" + link.linkId() + ",0) " + go_request.my_name + "=>server " + name_array_str);
        return name_array_str;
    };

    this.setupSession = function (go_request) {
        var session = this.sessionMgrObject().searchIt(go_request.my_name, go_request.his_name, Number(go_request.link_id));
        if (!session){
            session = this.sessionMgrObject().searchAndCreate(go_request.my_name, go_request.his_name, 0);
            if (!session) {
                res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
                this.abend("setupSession", "null session");
                return null;
            }
        }

        var his_link = this.linkMgrObject().searchLink(go_request.his_name, 0);
        if (!his_link) {
            res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            return null;
        }

        this.debug(true, "setupSession", "(" + go_request.link_id + "," + session.sessionId() + "," + session.hisSession().sessionId() + ") " + go_request.my_name + "=>" + go_request.his_name + " data=" + go_request.data);

        if (go_request.data !== null) {
            session.clusterObject().processSetupLinkData(go_request.data);
        }

        var session_id_str = "" + session.hisSession().sessionId();
        var data = JSON.stringify({
                        order: "setup_session",
                        session_id: session_id_str,
                        his_name: go_request.my_name,
                        my_name: go_request.his_name,
                        extra_data: go_request.data,
                    });
        his_link.receiveQueue().enQueue(data);
        this.sessionMgrObject().preSessionQueue().enQueue(data)
        return this.setupSessionReply(session, go_request);
    }

    this.setupSessionReply = function (session_val, go_request) {
        var session_id_str = "" + session_val.sessionId();
        var data = JSON.stringify({
                        session_id: session_id_str,
                        extra_data: go_request.data,
                    });
        this.logit("setupSessionReply", "(" + go_request.link_id + "," + session_val.sessionId() + "," + session_val.hisSession().sessionId() + ") " + go_request.my_name + "=>" + go_request.his_name);
        return data;
    };

    this.getSessionData = function (go_request) {
        this.debug(false, "getSessionData", "(" + go_request.link_id + "," + go_request.session_id + ") my_name=" + go_request.my_name + "=>" + go_request.his_name);
        var link = this.getLink(go_request);
        if (!link) {
            return null;
        }
        link.resetKeepAliveTimer();

        var session = this.sessionMgrObject().searchIt(go_request.my_name, go_request.his_name, Number(go_request.session_id));
        if (!session) {
            //res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            this.abend("getSessionData", "null session" + " session_id=" + go_request.session_id);
            return null;
        }

        var res_data = session.dequeueTransmitData();
        if (!res_data) {
            this.debug(false, "getSessionData", "no data");
            //res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            return null;
        }
        this.logit("getSessionData", "res_data=" + res_data);

        this.debug(false, "getSessionData", "ajax_id=" + go_request.ajax_id);
        this.logit("getSessionData", "(" + go_request.link_id + "," + go_request.session_id + ") "  + go_request.his_name + "=>" + go_request.my_name + " {" + res_data + "}");
        return res_data;
    };

    this.putSessionData = function (go_request) {
        //console.log(req.headers);
        this.debug(true, "putSessionData ", "ajax_id=" + go_request.ajax_id);
        this.debug(true, "putSessionData ", "(" + go_request.link_id + "," + go_request.session_id + ") "  + go_request.his_name + "=>" + go_request.my_name + " {" + go_request.data + "}");

        var session_id = Number(go_request.session_id);
        var xmt_seq = Number(go_request.xmt_seq);

        var link = this.getLink(go_request);
        if (!link) {
            return null;
        }
        link.resetKeepAliveTimer();

        var my_session = this.sessionMgrObject().searchIt(go_request.my_name, go_request.his_name, Number(go_request.session_id));
        if (!my_session) {
            res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            this.abend("putSessionData", "null my_session" + " session_id=" + go_request.session_id + " my_name=" + go_request.my_name + " his_name=" + go_request.his_name);
            return null;
        }

        this.debug(true, "putSessionData", "(" + go_request.link_id + "," + go_request.session_id + ") "  + go_request.my_name + "=>" + go_request.his_name + " {" + go_request.data + "} " + go_request.xmt_seq + "=>" + my_session.up_seq);

        if (xmt_seq === my_session.up_seq) {
            my_session.clusterObject().enqueAndPocessReceiveData(go_request.data);
            my_session.up_seq += 1;
        } else if (xmt_seq < my_session.up_seq) {
            if (xmt_seq === 0) {
                my_session.clusterObject().enqueAndPocessReceiveData(go_request.data);
                my_session.up_seq = 1;
                this.logit("putSessionData", go_request.data + " post " + xmt_seq + " reset");
            } else {
                this.logit("putSessionData", "(" + link_id + "," + session_id + ") "  + go_request.my_name + "=>" + go_request.his_name + " {" + go_request.data + "} " + xmt_seq + " dropped");
            }
        } else {
            this.logit("***abend: putSessionData", go_request.data + " post seq=" + xmt_seq + " dropped");
        }

        this.debug(true, "putSessionData", "queue_size=" + my_session.receiveQueue().size());
        return null;
    };

    this.keepAlive1111111111111111 = function (go_request) {
        var my_link_id = Number(go_request.link_id);
        this.debug(false, "keepAlive", "link_id=" + my_link_id + " my_name=" + go_request.my_name);
        var link = this.linkMgrObject().searchLink(go_request.my_name, my_link_id);
        if (!link) {
            res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            this.abend("keepAlive", "***null link***" + "link_id=" + my_link_id + " my_name=" + go_request.my_name);
            return null;
        }
        link.resetKeepAliveTimer();
        return null;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };
}
