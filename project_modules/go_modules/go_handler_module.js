/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_handler_module.js
 */

module.exports = {
    malloc: function (container_val) {
        return new GoHandlerObject(container_val);
    },
};

function GoHandlerObject(container_val) {
    "use strict";

    this.theObjectName = "GoHandlerObject";
    this.theContainerObject = container_val;

    this.mallocMove = function (str_val, x_val, y_val, color_val, turn_val, container_val) {
        var move_module = require("./go_move_module.js");
        return move_module.malloc(str_val, x_val, y_val, color_val, turn_val, container_val);
    };

    this.objectName = function () {
        return this.theObjectName;
    };

    this.GO = function () {
        return this.containerObject().GO();
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.portObject = function () {
        return this.containerObject().portObject();
    };

    this.uiObject = function () {
        return this.containerObject().uiObject();
    };

    this.engineObject = function () {
        return this.containerObject().engineObject();
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
            this.portObject().thansmitBoardData();
        } else {
            var move = this.mallocMove(str_val, 0, 0, 0, 0, this.containerObject());
            this.gameObject().addNewMoveAndFight(move);
            this.portObject().thansmitBoardData();
        }
    };

    this.aSpecialMoveIsPlayed = function (special_str) {
        //GO.goLog("GoHandlerObject.aSpecialMoveIsPlayed", special_str);
        this.gameObject().receiveSpecialMoveFromOpponent(special_str);
        //this.uiObject().drawBoard(this.engineObject());
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };
}
