/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: switch_module.js
 */

var the_fabric_ajax_parser_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_fabric_ajax_parser_object) {
            the_fabric_ajax_parser_object = new FabricAjaxParserClass(root_object_val);
        }
        return the_fabric_ajax_parser_object;
    },
};

function FabricAjaxParserClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.initSwitchTableArray();
        this.debug(true, "init__", "");
    };

    this.defaultLinkUpdateInterval = function () {
        return 3000;
    };

    this.debugInput = function () {
        return false;
    };

    this.debugOutput = function () {
        return false;
    };

    this.objectName = function () {
        return "FabricAjaxParserClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkMgrObject = function () {
        return this.rootObject().linkMgrObject();
    };

    this.clusterMgrObject = function () {
        return this.rootObject().clusterMgrObject();
    };

    this.linkListObject = function () {
        return this.linkMgrObject().linkListObject();
    };

    this.clusterMgrObject = function () {
        return this.rootObject().clusterMgrObject();
    };

    this.linkUpdateInterval = function () {
        return this.theLinkUpdateInterval;
    };

    this.setLinkUpdateInterval = function (val) {
        this.theLinkUpdateInterval = val;
    };

    this.httpSwitchTableArray = function (index_val) {
        return this.theHttpSwitchTableArray[index_val];
    };

    this.initSwitchTableArray = function () {
        var post_switch_table = {
            "setup_link": this.setupLink,
            "setup_session": this.setupSession,
        };
        var get_switch_table = {
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
        var put_switch_table = {
            "put_link_data": this.putLinkData,
            "put_session_data": this.putSessionData,
        };
        var delete_switch_table = {
            "delete_link": this.setupLink,
            "delete_session": this.setupSession,
        };
        this.theHttpSwitchTableArray = [post_switch_table,
                                        get_switch_table,
                                        put_switch_table,
                                        delete_switch_table,
                                        ];
    };

    this.parseGetRequest = function (input_val, command_index_val) {
        var go_request = JSON.parse(input_val);

        if (go_request.command === "get_link_data") {
            this.debug_(false, this.debugInput(), "switchRequest", "input_val=" + input_val);
        } else {
            this.debug_(true, this.debugInput(), "switchRequest", "input_val=" + input_val);
        }

        var func = this.httpSwitchTableArray(command_index_val)[go_request.command];
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

        var output = JSON.stringify({my_name: link.linkName(),
                               link_id: link.linkId(),
                              });
        this.debug_(true, this.debugOutput(), "setupLink", "output=" + output);
        return output;
    };

    this.getLinkObject = function (go_request) {
        var link = this.linkMgrObject().getLinkByIdName(go_request.link_id, go_request.my_name);
        if (!link) {
            this.debug(true, "getLinkObject", "null link: link_id=" + go_request.link_id + " my_name=" + go_request.my_name);
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
        link.resetKeepAliveTimer();

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
        this.debug_(false, this.debugOutput(), "getLinkData", "output=" + output);
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
        link.resetKeepAliveTimer();

        link.clearNameListChanged();
        var output = JSON.stringify({link_id: link.linkId(),
                                     name_list: this.linkMgrObject().getNameList(),
                                     });
        this.debug_(true, this.debugOutput(), "getNameList", "output=" + output);
        return output;
    };

    this.setupSession = function (go_request) {
        var link = this.getLinkObject(go_request);
        if (!link) {
            return null;
        }
        link.resetKeepAliveTimer();

        var cluster = this.clusterMgrObject().mallocCluster(go_request.topic_data);
        if (!cluster) {
            return null;
        }

        var session = link.mallocSession();
        if (!session) {
            return null;
        }

        cluster.addSession(session);
        session.setClusterObject(cluster);

        if (go_request.my_name !== go_request.his_name) {
            var his_link = this.linkMgrObject().getLinkByName(go_request.his_name);
            if (!his_link) {
                return null;
            }
            var his_session = his_link.mallocSession();
            if (!his_session) {
                return null;
            }
            cluster.addSession(his_session);
            his_session.setClusterObject(cluster);
            his_link.setPendingSessionSetup(his_session, go_request.topic_data);
        }

        if (go_request.topic_data !== null) {
            //session.clusterObject().processSetupTopicData(go_request.topic_data);
        }

        var output = JSON.stringify({
                            link_id: link.linkId(),
                            session_id: session.sessionId(),
                            his_name: go_request.his_name,
                            topic_data: go_request.topic_data,
                            });
        this.debug_(true, this.debugOutput(), "setupSession", "output=" + output);
        return output;
    };

    this.getSessionObject = function (go_request) {
        var link = this.linkMgrObject().getLinkById(go_request.link_id);
        if (!link) {
            this.logit("getSessionObject", "link not found: link_id=" + go_request.link_id);
            return null;
        }
        link.resetKeepAliveTimer();

        var session = link.getSession(go_request.session_id);
        if (!session) {
            this.logit("getSessionObject", "session not found" + " session_id=" + go_request.session_id);
            return null;
        }

        return session;
    };

    this.setupSessionReply = function (go_request) {
        var session = this.getSessionObject(go_request);
        if (!session) {
            return null;
        }
        var output = JSON.stringify({
                    link_id: session.linkObject().linkId(),
                    session_id: session.sessionId(),
                    confirm: "yes",
                    topic_data: go_request.topic_data,
                    his_name: "tbd",
                    });
        this.debug_(true, this.debugOutput(), "setupSessionReply", "output=" + output);
        return output;
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
        this.debug_(true, this.debugOutput(), "getSessionData", "output=" + output);
        return output;
    };

    this.putSessionData = function (go_request) {
        var session = this.getSessionObject(go_request);
        if (!session) {
            return null;
        }

        if (go_request.xmt_seq === session.up_seq) {
            session.clusterObject().TransmitData(go_request.data);
            session.up_seq += 1;
        } else if (go_request.xmt_seq < session.up_seq) {
            if (go_request.xmt_seq === 0) {
                session.clusterObject().TransmitData(go_request.data);
                session.up_seq = 1;
                this.logit("putSessionData", go_request.data + " xmt_seq=" + go_request.xmt_seq + " reset");
            } else {
                this.logit("putSessionData", "(" + link_id + "," + session_id + ") "  + go_request.my_name + "=>" + go_request.his_name + " {" + go_request.data + "} " + go_request.xmt_seq + " dropped");
            }
        } else {
            this.abend("putSessionData", go_request.data + " xmt_seq=" + go_request.xmt_seq + " up_seq=" + session.up_seq + "IS FIXED!!!");
            if (go_request.xmt_seq === session.up_seq + 1) {
                session.clusterObject().TransmitData(go_request.data);
                session.up_seq += 2;
            }
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
        this.debug_(true, this.debugOutput(), "getSessionData", "output=" + output);
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

    this.debug_ = function (debug_val, debug_val_, str1_val, str2_val) {
        if (debug_val && debug_val_) {
            this.logit(str1_val, str2_val);
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
