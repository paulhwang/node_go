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
            "setup_session_reply": this.setupSessionReply,
            "get_session_data": this.getSessionData,
            "put_session_data": this.putSessionData,
            "keep_alive": this.keepAlive,
        };
    };

    this.switchRequest = function (input_val) {
        var go_request = JSON.parse(input_val);
        if (go_request.command === "get_link_data") {
            this.debug(false, "switchRequest", "input_val=" + input_val);
        } else {
            this.debug(true, "switchRequest", "input_val=" + input_val);
        }

        var func = this.switch_table[go_request.command];
        if (func) {
            return func.bind(this)(go_request);
        } else {
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

        var output = JSON.stringify({my_name: link.myName(),
                               link_id: link.linkId(),
                              });
        this.debug(true, "setupLink", "output=" + output);
        return output;
    };

    this.getLinkObject = function (go_request) {
        var link = this.linkMgrObject().searchLinkByNameAndLinkId(go_request.my_name, go_request.link_id);
        if (!link) {
            this.abend("getLinkObject", "null link: link_id=" + go_request.link_id + " my_name=" + go_request.my_name);
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

        if (link.nameListChanged()) {
            this.debug(true, "getLinkData", "link.nameListChanged()=" + link.nameListChanged());
        }
        var pending_session_setup = link.getPendingSessionSetup();
        if (pending_session_setup) {
            this.debug(true, "getLinkData", "pending_session_setup=" + pending_session_setup);
        }
        var pending_session_data = link.getPendingSessionData();
        if (pending_session_data) {
            this.debug(true, "getLinkData", "pending_session_data=" + pending_session_data);
        }
        var data = link.receiveQueue().deQueue();
        if (data) {
            this.debug(true, "getLinkData", "link_id=" + go_request.link_id + " my_name="  + go_request.my_name + " data={" + data + "}");
        }

        var output = JSON.stringify({link_id: link.linkId(),
                               name_list: link.nameListChanged(),
                               data: data,
                               pending_session_setup: pending_session_setup,
                               pending_session_data: pending_session_data,
                               interval: this.linkUpdateInterval(),
                               });
        this.debug(false, "getLinkData", "output=" + output);
        return output;
    };

    this.putLinkData = function (go_request) {
        this.abend("putLinkData", "putLinkData is not implemented");
    };

    this.getNameList = function (go_request) {
        var link = this.getLinkObject(go_request);
        if (!link) {
            return null;
        }

        link.clearNameListChanged();
        var output = JSON.stringify({link_id: link.linkId(),
                                     name_list: this.linkMgrObject().getNameList(),
                                     });
        this.debug(true, "getNameList", "output=" + output);
        return output;
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

        if (go_request.my_name !== go_request.his_name) {
            var his_link = this.linkMgrObject().searchLinkByName(go_request.his_name);
            if (!his_link) {
                return null;
            }
            var his_session = his_link.mallocSession();
            if (!his_session) {
                return null;
            }
            his_link.setPendingSessionSetup(his_session, go_request.data);
        }

        if (go_request.data !== null) {
            //session.clusterObject().processSetupTopicData(go_request.data);
        }

        var output = JSON.stringify({
                            link_id: link.linkId(),
                            session_id: session.sessionId(),
                            extra_data: go_request.data,
                            });
        this.debug(true, "setupSession", "output=" + output);
        return output;
    };

    this.getSessionObject = function (go_request) {
        var link = this.linkMgrObject().searchLinkByLinkId(go_request.link_id);
        if (!link) {
            this.logit("getSessionObject", "link not found: link_id=" + go_request.link_id);
            return null;
        }

        var session = link.searchSessionBySessionId(go_request.session_id);
        if (!session) {
            this.logit("getSessionObject", "session not found" + " session_id=" + go_request.session_id);
            return null;
        }

        return session;
    };

    this.setupSessionReply = function (go_request) {
        this.debug(true, "setupSessionReply", "(" + go_request.link_id + "," + go_request.session_id + ")");

        var session = this.getSessionObject(go_request);
        if (!session) {
            return null;
        }
        return JSON.stringify({
                    link_id: session.linkObject().linkId(),
                    session_id: session.sessionId(),
                    });
    };

    this.getSessionData = function (go_request) {
        var session = this.getSessionObject(go_request);
        if (!session) {
            return null;
        }

        var res_data = session.dequeueTransmitData();
        if (!res_data) {
            this.debug(true, "getSessionData", "no data");
            return null;
        }
        this.debug(false, "getSessionData", "res_data=" + res_data);

        var output = JSON.stringify({
                    link_id: session.linkObject().linkId(),
                    session_id: session.sessionId(),
                    res_data: res_data,
                    });
        this.debug(true, "getSessionData", "output=" + output);
        return output;
    };

    this.putSessionData = function (go_request) {
        var session = this.getSessionObject(go_request);
        if (!session) {
            return null;
        }

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

        var res_data = session.dequeueTransmitData();
        if (!res_data) {
            this.debug(false, "putSessionData", "no data");
            return null;
        }

        var output = JSON.stringify({
                    link_id: session.linkObject().linkId(),
                    session_id: session.sessionId(),
                    res_data: res_data,
                    });
        this.debug(true, "getSessionData", "output=" + output);
        return output;
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
            this.logit(str1_val, str2_val);
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
