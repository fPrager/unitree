'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addWeatherEffect = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _addRain = require('./add-rain');

var _apiSettings = require('../../api-settings');

var _apiSettings2 = _interopRequireDefault(_apiSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yrno = require('yr.no-forecast')({
    request: {
        // make calls to locationforecast timeout after 15 seconds
        timeout: 15000
    }
});

var Canvas = require('canvas');

console.log(_apiSettings2.default.location);

var LOCATION = {
    // This is Dublin, Ireland
    lat: _apiSettings2.default.location.lat,
    lon: _apiSettings2.default.location.lon
};

var getRainFactor = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var weather, weatherData;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('start');
                        _context.next = 3;
                        return yrno.getWeather(LOCATION);

                    case 3:
                        weather = _context.sent;

                        console.log('got weather');
                        _context.next = 7;
                        return weather.getForecastForTime(new Date());

                    case 7:
                        weatherData = _context.sent;


                        console.log(weatherData);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getRainFactor() {
        return _ref.apply(this, arguments);
    };
}();

var addRainDrops = function addRainDrops(image, percent) {
    return new _promise2.default(function (resolve) {
        image.getBuffer(_jimp2.default.MIME_PNG, function (error, buffer) {
            var canvas = new Canvas(image.bitmap.width, image.bitmap.height);
            // const ctx = canvas.getContext('2d');
            var img = new Canvas.Image();
            img.src = buffer;
            var rainday = new _addRain.RainyDay({
                image: img, width: image.bitmap.width, height: image.bitmap.height, opacity: 1
            }, canvas);
            rainday.trail = rainday.TRAIL_SMUDGE;
            rainday.rain([[1, 2, percent], [2, 4, percent / 10]], 0.1);

            for (var i = 0; i < 100; i++) {
                rainday.animateDrops();
            }

            _jimp2.default.read(rainday.canvas.toBuffer(), function (err, result) {
                resolve(result);
            });
        });
    });
};

var addWeatherEffect = exports.addWeatherEffect = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(image) {
        var rainfactor, rainedImage;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return getRainFactor();

                    case 2:
                        rainfactor = _context2.sent;

                        console.log(rainfactor);
                        _context2.next = 6;
                        return addRainDrops(image, 1);

                    case 6:
                        rainedImage = _context2.sent;
                        return _context2.abrupt('return', rainedImage);

                    case 8:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function addWeatherEffect(_x) {
        return _ref2.apply(this, arguments);
    };
}();