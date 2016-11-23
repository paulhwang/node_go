/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_port.js
 */

module.exports = {
    malloc: function (port_object_val) {
        return new GoPortObject(port_object_val);
    },
};

function GoPortObject(port_object_val) {
    "use strict";
    this.GO_PROTOCOL_CODE_SIZE = 7;
    this.GO_PROTOCOL_CODE_PROPOSE = "Propose";
    this.GO_PROTOCOL_CODE_ACCEPT = "Accept ";
    this.GO_PROTOCOL_CODE_CONFIRM = "Confirm";
    this.GO_PROTOCOL_CODE_MOVE_DATA = "Move   ";
    this.GO_PROTOCOL_CODE_SPECIAL_MOVE = "Special";
    this.GO_PROTOCOL_CODE_BOARD_DATA = "Board  ";

    this.init__ = function (port_object_val) {
        this.theBaseObject = port_object_val;
        this.debug(false, "init__", "");
    };

    this.mallocMove = function (str_val, x_val, y_val, color_val, turn_val, port_object_val) {
        return require("./go_move.js").malloc(str_val, x_val, y_val, color_val, turn_val, port_object_val);
    };

    this.objectName = function () {
        return "GoPortObject";
    };

    this.containerObject = function () {
        return this.theBaseObject;
    };

    this.rootObject = function () {
        return this.containerObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.ajxObject = function () {
        return this.rootObject().ajxObject();
    };

    this.sessionMgrObject = function () {
        return this.sessionObject().sessionMgrObject();
    };

    this.configObject = function () {
        return this.containerObject().configObject();
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.engineObject = function () {
        return this.containerObject().engineObject();
    };

    this.clusterObject = function () {
        return this.containerObject().clusterObject();
    };

    this.GoHandlerObject = function () {
        return this.containerObject().handlerObject();
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.thansmitBoardData = function () {
        //this.goLog("transmitBoardData", "data=" + board_val);
        var board_data = this.GO_PROTOCOL_CODE_BOARD_DATA + this.boardObject().encodeBoard();
        var json_data = JSON.stringify({
                        board_data: board_data,
                        next_color: this.gameObject().nextColor(),
                        last_dead_stone: this.engineObject().lastDeadStone(),
                        capture_count: this.engineObject().captureCount(),
                        game_is_over: this.gameObject().gameIsOver(),
                        black_score: this.engineObject().blackScoreString(),
                        white_score: this.engineObject().whiteScoreString(),
                        final_score: this.engineObject().finalScoreString(),
                    });
        this.transmitData(json_data);
    };

    this.transmitData = function (data_val) {
        this.clusterObject().enqueueTransmitData(data_val);
        this.clusterObject().processTransmitData();
    };

    this.receiveStringData = function (str_val) {
        this.debug(false, "receiveStringData", str_val);

        if (str_val == null) {
            this.abend("receiveStringData", "null input");
            return;
        }

        var code = str_val.slice(0, this.GO_PROTOCOL_CODE_SIZE);
        var data = str_val.slice(this.GO_PROTOCOL_CODE_SIZE);
        //this.goLog("receiveStringData", code);
        //this.goLog("receiveStringData", data);

        if (code == this.GO_PROTOCOL_CODE_MOVE_DATA) {
            this.aMoveIsPlayed(data);
            return;
        }

        if (code == this.GO_PROTOCOL_CODE_SPECIAL_MOVE) {
            this.aSpecialMoveIsPlayed(data);
            return;
        }
    };

    this.aMoveIsPlayed = function (str_val) {
        //this.goLog("aMoveIsPlayed", str_val);
        if (this.gameObject().gameIsOver()) {
            var index = 0;
            var x = (str_val.charAt(index++) - '0') * 10;
            x += (str_val.charAt(index++) - '0');
            var y = (str_val.charAt(index++) - '0') * 10;
            y += (str_val.charAt(index++) - '0');
            if ((str_val.charAt(index++) - '0') !== this.GO().MARK_DEAD_STONE_DIFF()) {
                this.abend("aMoveIsPlayed", "game is over");
                return;
            }
            this.engineObject().markDeadGroup(x, y);
            this.engineObject().abendEngine();
            this.thansmitBoardData();
        } else {
            var move = this.mallocMove(str_val, 0, 0, 0, 0, this.containerObject());
            this.gameObject().addNewMoveAndFight(move);
            this.thansmitBoardData();
        }
    };

    this.aSpecialMoveIsPlayed = function (special_str) {
        //GO.goLog("GoHandlerObject.aSpecialMoveIsPlayed", special_str);
        this.gameObject().receiveSpecialMoveFromOpponent(special_str);
        //this.uiObject().drawBoard(this.engineObject());
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        return this.containerObject().goLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(port_object_val);
}

