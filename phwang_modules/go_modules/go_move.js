/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_move_module.js
 */

module.exports = {
    malloc: function (str_val, x_val, y_val, color_val, turn_val, container_val) {
        return new GoMoveObject(str_val, x_val, y_val, color_val, turn_val, container_val);
    },
};

function GoMoveObject(str_val, x_val, y_val, color_val, turn_val, container_val) {
    "use strict";

    this.init__ = function (str_val, x_val, y_val, color_val, turn_val, container_val) {
        this.theBaseObject = container_val;

        if (!str_val) {
            this.theX = x_val;
            this.theY = y_val;
            this.theMyColor = color_val;
            this.theTurnIndex = turn_val;
        } else {
            this.moveObjectDecode(str_val);
        }
        this.debug(true, "init__", "(" + this.xX() + "," + this.yY() + ") color=" + this.myColor() + " turn=" + this.turnIndex());
    };

    this.objectName = function () {
        return "GoMoveObject";
    };

    this.GO = function () {
        return this.containerObject().GO();
    };

    this.containerModule = function () {
        return this.theContainerModule;
    };

    this.containerObject = function () {
        return this.theBaseObject;
    };

    this.xX = function () {
        return this.theX;
    };

    this.yY = function () {
        return this.theY;
    };

    this.myColor = function () {
        return this.theMyColor;
    };

    this.turnIndex = function () {
        return this.theTurnIndex;
    };

    this.encodeMove = function () {
        var buf = "";
        if (this.xX() < 10) {
            buf = buf + 0;
        }
        buf = buf + this.xX();

        if (this.yY() < 10) {
            buf = buf + 0;
        }
        buf = buf + this.yY();

        buf = buf + this.myColor();

        if (this.turnIndex() < 100) {
            buf = buf + 0;
        }
        if (this.turnIndex() < 10) {
            buf = buf + 0;
        }
        buf = buf + this.turnIndex();

        //this.debug(true, "encodeMove", "output=" + buf);
        return buf;
    };

    this.moveObjectDecode = function (str_val) {
        //this.debug(false, "moveObjectDecode", "input=" + str_val);
        var index = 0;
        this.theX = (str_val.charAt(index++) - '0') * 10;
        this.theX += (str_val.charAt(index++) - '0');
        this.theY = (str_val.charAt(index++) - '0') * 10;
        this.theY += (str_val.charAt(index++) - '0');
        this.theMyColor = (str_val.charAt(index++) - '0');
        this.theTurnIndex = (str_val.charAt(index++) - '0') * 100;
        this.theTurnIndex += (str_val.charAt(index++) - '0') * 10;
        this.theTurnIndex += (str_val.charAt(index++) - '0');
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

    this.init__(str_val, x_val, y_val, color_val, turn_val, container_val);
}
