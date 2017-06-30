/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_serveric.js
 */

var LINK_MGR_SERVICE_IP_ADDRESS = "52.24.162.133";
var LINK_MGR_SERVICE_IP_PORT = 8006;

var the_link_mgr_service_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_link_mgr_service_object) {
            the_link_mgr_service_object = new LinkMgrServiceClass(root_object_val);
        }
        return the_link_mgr_service_object;
    },

};

function LinkMgrServiceClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theNetClientObject = this.importObject().importNetClient().malloc(this.rootObject());
        this.setupConnectionToLinkMgr();


        this.theGlobalLinkId = 0;
        this.theLinkIndexArray = [0];
        this.theLinkTableArray = [null];
        this.theNameListChanged = false;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "LinkMgrServiceClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.netClientOjbect = function () {
        return this.theNetClientObject;
    };

    this.ajaxParserObject = function () {
        return this.rootObject().ajaxParserObject();
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.setupConnectionToLinkMgr = function () {
        var this0 = this;
        this.netClientOjbect().connect(LINK_MGR_SERVICE_IP_PORT, LINK_MGR_SERVICE_IP_ADDRESS, function () {
            this0.debug(true, "init__", "LinkMgrService is connected");
        });

        this.netClientOjbect().onData(function (data_val) {
        this0.debug(true, "onData==================================", data_val);
            this0.receiveDataFromLinkMgr(data_val);
        });

        this.netClientOjbect().onClose(function () {
            this0.receiveCloseFromLinkMgr();
        });
    };

    this.receiveDataFromLinkMgr = function (data_val) {
        this.debug(true, "receiveDataFromLinkMgr", data_val);
        this.callbackFunc.bind(this.ajaxParserObject())(this.ajaxParserObject(), this.theGoRequest, this.theRes, data_val.slice(1));
    };

    this.receiveCloseFromLinkMgr = function () {
        this.debug(true, "receiveCloseFromLinkMgr", "");
    };

    this.mallocLink = function (my_name_val, callback_func_val, go_request_val, res_val) {
        this.callbackFunc = callback_func_val;
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("L" + my_name_val);
    };

    this.getLinkByIdIndexName = function (link_id_index_val, link_name_val) {
        this.debug(true, "getLinkByIdIndexName", "link_id_index_val=" + link_id_index_val);
    };

    this.getNameList = function (link_id_index_val, callback_func_val, go_request_val, res_val) {
        this.debug(false, "getNameList", "link_id_index_val=" + link_id_index_val);
        this.callbackFunc = callback_func_val;
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("N" +  link_id_index_val);

    };

    this.getLinkData = function (link_id_index_val, callback_func_val, go_request_val, res_val) {
        this.debug(false, "getLinkData", "link_id_index_val=" + link_id_index_val);
        this.callbackFunc = callback_func_val;
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("G" +  link_id_index_val);

    };

    this.mallocSession = function (link_id_index_val, his_name_val, theme_data_val, callback_func_val, go_request_val, res_val) {
        this.debug(true, "mallocSession", "link_id_index_val=" + link_id_index_val + " his_name_val=" + his_name_val);
        this.callbackFunc = callback_func_val;
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("S" + link_id_index_val + theme_data_val + his_name_val);
    };

    this.getSessionData = function (link_id_index_val, session_id_index_val, callback_func_val, go_request_val, res_val) {
        this.debug(true, "getSessionData", "link_id_index_val=" + link_id_index_val + " session_id_index_val=" + session_id_index_val);

    };

    this.putSessionData = function (link_id_index_val, session_id_index_val, data_val, callback_func_val, go_request_val, res_val) {
        this.debug(true, "putSessionData", "link_id_index_val=" + link_id_index_val + " session_id_index_val=" + session_id_index_val + " data_val=" + data_val);
        this.callbackFunc = callback_func_val;
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("P" + link_id_index_val + session_id_index_val + data_val);

    };



/*



    this.linkIndexArray = function () {
        return this.theLinkIndexArray;
    };

    this.linkTableArray = function () {
        return this.theLinkTableArray;
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.linkTableArrayLength = function () {
        return this.linkTableArray().length;
    };

    this.linkTableArrayElement = function (index_val) {
        return this.linkTableArray()[index_val];
    };

    this.setLinkTableArrayElement = function (index_val, data_val) {
        return this.linkTableArray()[index_val] = data_val;
    };

    this.setLinkIndexArrayElement = function (index_val, data_val) {
        return this.linkIndexArray()[index_val] = data_val;
    };

    this.globalLinkId = function () {
        return this.theGlobalLinkId;
    };

    this.incrementGlobalLinkId = function () {
        this.theGlobalLinkId += 1;
    };

    this.allocLinkId = function () {
        this.incrementGlobalLinkId();
        return this.globalLinkId();
    }

    this.mallocLink = function (my_name_val) {
        var link = this.importObject().importLink().malloc(this.rootObject(), this.allocLinkId(), my_name_val);
        this.linkIndexArray().push(link.linkId());
        this.linkTableArray().push(link);
        this.setNameListChanged();
        return link;
    }

    this.freeLink = function (link_object_val) {
        var index = this.linkIndexArray().indexOf(link_object_val.linkId());
        if (index && index !== -1) {
            this.setLinkIndexArrayElement(index, undefined);
            this.setLinkTableArrayElement(index, null);
        }
    };

    this.getLinkByIdName = function (link_id_val, link_name_val) {
        var index = this.linkIndexArray().indexOf(link_id_val);
        if (index === -1) {
            return null;
        } else {
            var link =this.linkTableArray()[index];
            return link;
        }
    };

    this.getLinkById = function (link_id_val) {
        var index = this.linkIndexArray().indexOf(link_id_val);
        if (index === -1) {
            return null;
        } else {
            var link =this.linkTableArray()[index];
            return link;
        }
    };

    this.getLinkByName = function (name_val) {
        var i = this.linkTableArrayLength() - 1;
        while (i > 0) {
            var link = this.linkTableArrayElement(i);
            if (link) {
                if (link.linkName() === name_val) {
                    return link;
                }
            }
            i -= 1;
        }
        return null;
    };

    this.setNameListChanged = function () {
        var i = this.linkTableArrayLength() - 1;
        while (i > 0) {
            var link = this.linkTableArrayElement(i);
            if (link) {
                link.setNameListChanged();
            }
            i -= 1;
        }
    };

    this.getNameList = function () {
        var name_array = [];
        var j = 0;
        var i = this.linkTableArrayLength() - 1;
        while (i > 0) {
            var link = this.linkTableArrayElement(i);
            if (link) {
                name_array[j] = link.myName();
                j += 1;
            }
            i -= 1;
        }
       return name_array;
    };
*/
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
