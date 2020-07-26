'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _loadImageSimple = require('./layer/loadImageSimple');

var _addWeatherEffect = require('./weather/add-weather-effect');

var _addTree = require('./tree/add-tree');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var render = exports.render = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var image, imageWithTree, imageWithWeather;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _loadImageSimple.loadImageSimple)('imageOrig.png', { stretch: true });

                    case 2:
                        image = _context.sent;
                        _context.next = 5;
                        return (0, _addTree.addTree)(image);

                    case 5:
                        imageWithTree = _context.sent;
                        _context.next = 8;
                        return (0, _addWeatherEffect.addWeatherEffect)(imageWithTree);

                    case 8:
                        imageWithWeather = _context.sent;
                        return _context.abrupt('return', imageWithWeather);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function render() {
        return _ref.apply(this, arguments);
    };
}();