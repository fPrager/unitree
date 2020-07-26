'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addTree = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _renderSettings = require('../../render-settings.json');

var _renderSettings2 = _interopRequireDefault(_renderSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('canvas'),
    createCanvas = _require.createCanvas;

var startX = 180;
var startY = 550;

var width = _renderSettings2.default.width;
var height = _renderSettings2.default.height;
var halfHeight = height / 2;

var initialRadius = 10;
var canvas = void 0;
var branches = void 0;

var Branch = function Branch() {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.x = startX;
    this.y = startY;
    this.radius = 10;
    this.angle = Math.PI / 2;

    var hue = 0;
    var sat = 0;
    var lit = 10;

    this.fillStyle = 'hsla(' + hue + ', ' + sat + '%, ' + lit + '%, 0.4)';
    // this.shadowColor = `hsla(${hue}, ${sat}%, ${lit}%, 0.1)`;
    // this.shadowBlur = 2;

    this.speed = 1;
    this.generation = 0;
    this.distance = 0;
};

Branch.prototype = {
    // 主要的处理过程发生在这里
    process: function process() {
        // 在当前的坐标处画出一个圆形
        this.draw();
        // 把当前的branch继续向上延伸一部分
        this.iterate();
        this.split();
        this.die();
    },
    draw: function draw() {
        var context = this.context;
        context.save();
        context.fillStyle = this.fillStyle;
        context.shadowColor = this.shadowColor;
        context.shadowBlur = this.shadowBlur;
        context.beginPath();
        context.moveTo(this.x, this.y);
        // 图形是依靠在各个坐标处画出的圆形组合而成
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
        context.restore();
    },
    iterate: function iterate() {
        var deltaX = this.speed * Math.cos(this.angle);
        var deltaY = -this.speed * Math.sin(this.angle);

        // 利用speed控制需要向上延伸的距离
        this.x += deltaX;
        this.y += deltaY;
        // 根据当前是第几代，减小半径值
        this.radius *= 0.99 - this.generation / 250;

        // 求出距离的增量
        var deltaDistance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

        // distance指的是当前的这一段树枝的长度
        this.distance += deltaDistance;

        // 控制speed的大小，使绘图时不至于在两个圆之间出现空白
        if (this.speed > this.radius * 2) {
            this.speed = this.radius * 2;
        }

        // 产生一个范围在（-0.1, 0.1)之间的随机数,对角度进行一个偏转
        this.angle += Math.random() / 5 - 1 / 5 / 2;
    },
    split: function split() {
        var splitChance = 0;
        // 树干部分，长度大于画面高度1/5时开始分叉
        if (this.generation == 1) {
            splitChance = this.distance / halfHeight - 0.2;
        }
        // 树枝部分
        else if (this.generation < 3) {
                splitChance = this.distance / halfHeight - 0.1;
            }

        if (Math.random() < splitChance) {
            // 下一代生成n个树枝
            var n = 2 + Math.round(Math.random() * 3);
            for (var i = 0; i < n; i++) {
                var branch = new Branch();
                branch.x = this.x;
                branch.y = this.y;
                branch.angle = this.angle;
                branch.radius = this.radius * 0.9;
                branch.generation++;
                branch.fillStyle = this.fillStyle;

                // 将branch加入到集合中去
                branches.add(branch);
            }
            // 将父代branch删去
            branches.remove(this);
        }
    },
    die: function die() {
        if (this.radius < 0.5) {
            branches.remove(this);
        }
    }
};

var BranchCollection = function BranchCollection() {
    this.branches = [];
    this.canvas = canvas;
};

BranchCollection.prototype = {
    add: function add(branch) {
        this.branches.push(branch);
    },


    // 依次处理集合内的每一个元素
    process: function process() {
        for (var b in this.branches) {
            this.branches[b].process();
        }
    },
    remove: function remove(branch) {
        for (var b in this.branches) {
            if (this.branches[b] === branch) {
                this.branches.splice(b, 1);
            }
        }
    }
};

var addTree = exports.addTree = function addTree(image) {
    return new _promise2.default(function (resolve) {
        image.getBuffer(_jimp2.default.MIME_PNG, function (error, buffer) {
            canvas = createCanvas(image.bitmap.width, image.bitmap.height);
            // const ctx = canvas.getContext('2d');
            branches = new BranchCollection();
            var n = 2 + Math.random() * 3;

            for (var i = 0; i < n; i++) {
                var branch = new Branch();
                // branch.x = startX - initialRadius + i * 2 * initialRadius / n;
                branch.radius = initialRadius;
                branches.add(branch);
            }

            while (branches.branches.length > 0) {
                branches.process();
            }_jimp2.default.read(canvas.toBuffer(), function (err, result) {
                resolve(image.composite(result, 0, 0));
            });
        });
    });
};