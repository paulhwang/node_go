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

setupLink_ = function (switch_val, go_request) {
    return switch_val.setupLink(go_request);
};

getLinkData_ = function (switch_val, go_request) {
    return switch_val.getLinkData(go_request);
};

putLinkData_ = function (switch_val, go_request) {
    return switch_val.put_link_data(go_request);
};

getNameList_ = function (switch_val, go_request) {
    return switch_val.getNameList(go_request);
};

setupSession_ = function (switch_val, go_request) {
    return switch_val.setupSession(go_request);
};

getSessionData_ = function (switch_val, go_request) {
    return switch_val.getSessionData(go_request);
};

putSessionData_ = function (switch_val, go_request) {
    return switch_val.putSessionData(go_request);
};

keepAlive_ = function (switch_val, go_request) {
    return switch_val.keepAlive_(go_request);
};

var switch_table_ = {
    "setup_link": setupLink_,
    "get_link_data": getLinkData_,
    "put_link_data": putLinkData_,
    "get_name_list": getNameList_,
    "setup_session": setupSession_,
    "get_session_data": getSessionData_,
    "put_session_data": putSessionData_,
    "keep_alive": keepAlive_,
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
        this.debug(false, "dispatchRequest", "command=" + go_request.command);

        var func = this.switch_table[go_request.command];
        if (func) {
            return func.bind(this)(go_request);
        }
        else {
            this.abend("dispatchRequest", "bad command=" + go_request.command);
            return null;
        }

        var func = switch_table_[go_request.command];
        if (func) {
            return func(this, go_request);
        }
        else {
            this.abend("dispatchRequest", "bad command=" + go_request.command);
            return null;
        }

        if (go_request.command === "setup_link") {
            return this.setupLink(go_request);
        }

        if (go_request.command === "keep_alive") {
            return this.keepAlive(go_request);
        }

        if (go_request.command === "get_link_data") {
            return this.getLinkData(go_request);
        }

        if (go_request.command === "put_link_data") {
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

        this.abend("dispatchRequest", "bad command=" + go_request.command);
        return null;
    }

    this.setupLink = function (go_request) {
        if (!go_request) {
            this.abend("setupLink", "null go_request");
            return null;
        }

        var link = this.linkMgrObject().searchAndCreate(go_request.my_name, 0);
        if (!link) {
            this.abend("setupLink", "null link");
            return null;
        }
        link.resetKeepAliveTimer();

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

    this.putLinkData = function (go_request) {
        this.abend("putLinkData", "putLinkData is not implemented");
    };

    this.getLink = function (go_request) {
        var link = this.linkMgrObject().searchLink(go_request.my_name, go_request.link_id);
        if (!link) {
            this.abend("getLink", "null link" + "link_id=" + go_request.link_id + " my_name=" + go_request.my_name);
            return null;
        }
        if (link.linkId() === 0) {
            this.abend("getLink", "link_id = 0");
            return null;
        }
        return link;
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
        var session = this.sessionMgrObject().searchSession(go_request.my_name, go_request.his_name, go_request.link_id);
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
            session.clusterObject().processSetupTopicData(go_request.data);
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

        var session = this.sessionMgrObject().searchSession(go_request.my_name, go_request.his_name, go_request.session_id);
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

        var link = this.getLink(go_request);
        if (!link) {
            return null;
        }
        link.resetKeepAliveTimer();

        var my_session = this.sessionMgrObject().searchSession(go_request.my_name, go_request.his_name, go_request.session_id);
        if (!my_session) {
            //res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            this.abend("putSessionData", "null my_session" + " session_id=" + go_request.session_id + " my_name=" + go_request.my_name + " his_name=" + go_request.his_name);
            return null;
        }

        this.debug(true, "putSessionData", "(" + go_request.link_id + "," + go_request.session_id + ") "  + go_request.my_name + "=>" + go_request.his_name + " {" + go_request.data + "} " + go_request.xmt_seq + "=>" + my_session.up_seq);

        if (go_request.xmt_seq === my_session.up_seq) {
            my_session.clusterObject().enqueAndPocessReceiveData(go_request.data);
            my_session.up_seq += 1;
        } else if (go_request.xmt_seq < my_session.up_seq) {
            if (go_request.xmt_seq === 0) {
                my_session.clusterObject().enqueAndPocessReceiveData(go_request.data);
                my_session.up_seq = 1;
                this.logit("putSessionData", go_request.data + " post " + go_request.xmt_seq + " reset");
            } else {
                this.logit("putSessionData", "(" + link_id + "," + session_id + ") "  + go_request.my_name + "=>" + go_request.his_name + " {" + go_request.data + "} " + go_request.xmt_seq + " dropped");
            }
        } else {
            this.logit("***abend: putSessionData", go_request.data + " post seq=" + xmt_seq + " dropped");
        }

        this.debug(true, "putSessionData", "queue_size=" + my_session.receiveQueue().size());
        return null;
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
        link.resetKeepAliveTimer();
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

    this.initSwitchTable();
}
