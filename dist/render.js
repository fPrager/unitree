'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = undefined;

var _loadImageSimple = require('./layer/loadImageSimple');

var render = exports.render = function render() {
    return (0, _loadImageSimple.loadImageSimple)('https://s3.eu-central-1.amazonaws.com/unitree/people.png', { stretch: true });
};