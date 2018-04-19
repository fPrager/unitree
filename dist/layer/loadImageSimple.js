'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadImageSimple = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _renderSettings = require('../../render-settings.json');

var _renderSettings2 = _interopRequireDefault(_renderSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadImageSimple = exports.loadImageSimple = function loadImageSimple(url, options) {
    return new _promise2.default(function (resolve) {
        _jimp2.default.read(url).then(function (image) {
            if (options.stretch) {
                image.resize(_renderSettings2.default.width, _renderSettings2.default.height);
            }
            resolve(image);
        });
    });
};