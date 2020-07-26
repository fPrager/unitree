'use strict';

var _render = require('./render');

(0, _render.render)().then(function (image) {
    image.write('result.png');
});