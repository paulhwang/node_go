/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: switch_module.js
 */

module.exports = {
    malloc: function (fabric_val) {
        return new SwitchObject(fabric_val);
    },
};

function SwitchObject(fabric_val) {
    "use strict";

    this.init__ = function (fabric_val) {
        this.theFabricObject = fabric_val;
        this.initSwitchTable();
    };

    this.linkModuleMalloc = function (my_name_val, link_id_val) {
        var link_module = require("./link_module.js");
        return link_module.malloc(this, my_name_val, link_id_val);
    };

    this.defaultLinkUpdateInterval = function () {
        return 3000;
    };

    this.objectName = function () {
        return "SwitchObject";
    };

    this.fabricObject = function () {
        return this.theFabricObject;
    };

    this.rootObject = function () {
        return this.fabricObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.linkMgrObject = function () {
        return this.fabricObject().linkMgrObject();
    };

    this.clusterMgrObject = function () {
        return this.fabricObject().clusterMgrObject();
    };

    this.sessionMgrObject = function () {
        return this.fabricObject().sessionMgrObject();
    };

    this.linkUpdateInterval = function () {
        return this.theLinkUpdateInterval;
    };

    this.setLinkUpdateInterval = function (val) {
        this.theLinkUpdateInterval = val;
    };

    this.initSwitchTable = function () {
        this.switch_table = {
            "setup_link": this.setupLink,
            "get_link_data": this.getLinkData,
            "put_link_data": this.putLinkData,
            "get_name_list": this.getNameList,
            "setup_session": this.setupSession,
            "get_session_data": this.getSessionData,
            "put_session_data": this.putSessionData,
            "keep_alive": this.keepAlive,
        };
    };

    this.switchRequest = function (go_request) {
        if (!go_request) {
            this.abend("switchRequest", "null go_request");
            return null;
        }

        this.debug(false, "switchRequest", "command=" + go_request.command);

        var func = this.switch_table[go_request.command];
        if (func) {
            return func.bind(this)(go_request);
        }
        else {
            this.abend("switchRequest", "bad command=" + go_request.command);
            return null;
        }
    }

    this.setupLink = function (go_request) {
        var link = this.linkMgrObject().mallocLink(go_request.my_name);
        if (!link) {
            this.abend("setupLink", "null link");
            return null;
        }
        link.resetKeepAliveTimer();
        this.setLinkUpdateInterval(this.defaultLinkUpdateInterval());

        this.debug(true, "setupLink", "name=" + go_request.my_name + " link_id=" + link.linkId());
        return JSON.stringify({link_id: link.linkId(),
                              });
    };

    this.getLinkObject = function (go_request) {
        var link = this.linkMgrObject().searchLinkByNameAndLinkId(go_request.my_name, go_request.link_id);
        if (!link) {
            this.abend("getLinkObject", "null link" + "link_id=" + go_request.link_id + " my_name=" + go_request.my_name);
            return null;
        }
        if (link.linkId() === 0) {
            this.abend("getLinkObject", "link_id = 0");
            return null;
        }
        link.resetKeepAliveTimer();
        return link;
    };

    this.getLinkData = function (go_request) {
        this.debug(false, "getLinkData", "link_id=" + go_request.link_id + " my_name=" + go_request.my_name + " ajax_id=" + go_request.ajax_id);

        var link = this.getLinkObject(go_request);
        if (!link) {
            return null;
        }

        var pending_session_setup = link.getPendingSessionSetup();
        var pending_session_data = link.getPendingSessionData();
        var data = link.receiveQueue().deQueue();
        if (data) {
            this.logit("getLinkData", "link_id=" + go_request.link_id + " my_name="  + go_request.my_name + " data={" + data + "}");
        }

        return JSON.stringify({link_id: link.linkId(),
                               name_list: link.nameListChanged(),
                               data: data,
                               pending_session_setup: pending_session_setup,
                               pending_session_data: pending_session_data,
                               interval: this.linkUpdateInterval(),
                               });
    };

    this.putLinkData = function (go_request) {
        this.abend("putLinkData", "putLinkData is not implemented");
    };

    this.getNameList = function (go_request) {
        this.debug(true, "getNameList", "start");
        var link = this.getLinkObject(go_request);
        if (!link) {
            return null;
        }

        link.clearNameListChanged();
        var json_data = JSON.stringify(this.linkMgrObject().getNameList());
        this.debug(true, "getNameList", "(" + link.linkId() + ",0) " + go_request.my_name + "=>server " + json_data);
        return json_data;
    };

    this.setupSession = function (go_request) {
        var link = this.getLinkObject(go_request);
        if (!link) {
            return null;
        }

        var session = link.mallocSession();
        if (!session) {
            return null;
        }

        var cluster = this.clusterMgrObject().mallocCluster(go_request.data, session);
        if (!cluster) {
            return null;
        }

        if (go_request.data !== null) {
            //session.clusterObject().processSetupTopicData(go_request.data);
        }

        var json_data = JSON.stringify({
                        session_id: session.sessionId(),
                        extra_data: go_request.data,
                    });
        this.logit("setupSessionReply", "(" + go_request.link_id + ":" + session.sessionId() + ") " + go_request.my_name + "=>" + go_request.his_name);
        return json_data;
    }

    this.getSessionObject = function (go_request) {
        var link = this.getLinkObject(go_request);
        if (!link) {
            return null;
        }

        var session = link.searchSessionBySessionId(go_request.session_id);
        if (!session) {
            this.abend("getSessionObject", "null session" + " session_id=" + go_request.session_id);
            return null;
        }

        return session;
    };

    this.getSessionData = function (go_request) {
        this.debug(false, "getSessionData", "(" + go_request.link_id + "," + go_request.session_id + ") my_name=" + go_request.my_name + "=>" + go_request.his_name);

        var session = this.getSessionObject(go_request);
        if (!session) {
            return null;
        }

        var res_data = session.dequeueTransmitData();
        if (!res_data) {
            this.debug(false, "getSessionData", "no data");
            return null;
        }
        this.logit("getSessionData", "res_data=" + res_data);

        this.debug(false, "getSessionData", "ajax_id=" + go_request.ajax_id);
        this.logit("getSessionData", "(" + go_request.link_id + "," + go_request.session_id + ") "  + go_request.his_name + "=>" + go_request.my_name + " {" + res_data + "}");
        return JSON.stringify({session_id: session.sessionId(),
                               res_data: res_data,
                           });
    };

    this.putSessionData = function (go_request) {
        //console.log(req.headers);
        this.debug(true, "putSessionData ", "ajax_id=" + go_request.ajax_id);
        this.debug(true, "putSessionData ", "(" + go_request.link_id + "," + go_request.session_id + ") "  + go_request.his_name + "=>" + go_request.my_name + " {" + go_request.data + "}");

        var session = this.getSessionObject(go_request);
        if (!session) {
            return null;
        }

        this.debug(true, "putSessionData", "(" + go_request.link_id + "," + go_request.session_id + ") "  + go_request.my_name + "=>" + go_request.his_name + " {" + go_request.data + "} " + go_request.xmt_seq + "=>" + session.up_seq);

        if (go_request.xmt_seq === session.up_seq) {
            session.clusterObject().enqueAndPocessReceiveData(go_request.data);
            session.up_seq += 1;
        } else if (go_request.xmt_seq < session.up_seq) {
            if (go_request.xmt_seq === 0) {
                session.clusterObject().enqueAndPocessReceiveData(go_request.data);
                session.up_seq = 1;
                this.logit("putSessionData", go_request.data + " post " + go_request.xmt_seq + " reset");
            } else {
                this.logit("putSessionData", "(" + link_id + "," + session_id + ") "  + go_request.my_name + "=>" + go_request.his_name + " {" + go_request.data + "} " + go_request.xmt_seq + " dropped");
            }
        } else {
            this.logit("***abend: putSessionData", go_request.data + " post seq=" + xmt_seq + " dropped");
        }

        this.debug(true, "putSessionData", "queue_size=" + session.receiveQueue().size());
        //return null;

        var res_data = session.dequeueTransmitData();
        if (!res_data) {
            this.debug(false, "putSessionData", "no data");
            return null;
        }
        this.logit("putSessionData", "res_data=" + res_data);

        this.debug(false, "putSessionData", "ajax_id=" + go_request.ajax_id);
        this.logit("putSessionData", "(" + go_request.link_id + "," + go_request.session_id + ") "  + go_request.his_name + "=>" + go_request.my_name + " {" + res_data + "}");
        return JSON.stringify({session_id: session.sessionId(),
                               res_data: res_data,
                           });
    };

    this.keepAlive = function (go_request) {
        this.abend("keepAlive", "keepAlive is not implemented");
        var my_link_id = go_request.link_id;
        this.debug(false, "keepAlive", "link_id=" + my_link_id + " my_name=" + go_request.my_name);
        var link = this.linkMgrObject().searchLink(go_request.my_name, my_link_id);
        if (!link) {
            res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            this.abend("keepAlive", "***null link***" + "link_id=" + my_link_id + " my_name=" + go_request.my_name);
            return null;
        }
        return null;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(fabric_val);
}
