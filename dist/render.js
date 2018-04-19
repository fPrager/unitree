'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = undefined;

var _loadImageSimple = require('./layer/loadImageSimple');

var render = exports.render = function render() {
    (0, _loadImageSimple.loadImageSimple)('https://s3.eu-central-1.amazonaws.com/unitree/imageOrig.png', { stretch: true }).then(function () {
        console.log('image loaded');
    });
};