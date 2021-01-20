"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.logger = void 0;
var fs = require("fs");
var util_1 = require("util");
var COLORS = {
    info: '\u001b[37m',
    error: '\u001b[31m',
    warning: '\u001b[33m',
    success: '\u001b[32m',
    ext: '\u001b[34m'
};
var DATETIME_LENGTH = 19;
var Logger = /** @class */ (function () {
    function Logger() {
        this.stream = fs.createWriteStream('./log.txt', { flags: 'a' });
    }
    Logger.prototype.write = function (level) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var s = util_1.format.apply(void 0, __spreadArrays([''], args));
        var now = new Date().toISOString();
        var date = now.substring(0, DATETIME_LENGTH);
        var color = COLORS[level];
        var line = date + '\t' + s + '\n';
        console.log(color + line + '\x1b[0m');
        this.stream.write(line);
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write.apply(this, __spreadArrays(['info'], args));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write.apply(this, __spreadArrays(['error'], args));
    };
    Logger.prototype.success = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write.apply(this, __spreadArrays(['success'], args));
    };
    Logger.prototype.ext = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write.apply(this, __spreadArrays(['ext'], args));
    };
    return Logger;
}());
exports.logger = new Logger();
