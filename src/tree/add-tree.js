import Jimp from 'jimp';
import renderSettings from '../../render-settings.json';


const Canvas = require('canvas');

const startX = 180;
const startY = 550;

const width = renderSettings.width;
const height = renderSettings.height;
const halfHeight = height / 2;

const initialRadius = 10;
let canvas;
let branches;

const Branch = function () {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.x = startX;
    this.y = startY;
    this.radius = 10;
    this.angle = Math.PI / 2;

    const hue = 0;
    const sat = 0;
    const lit = 10;

    this.fillStyle = `hsla(${hue}, ${sat}%, ${lit}%, 0.4)`;
    // this.shadowColor = `hsla(${hue}, ${sat}%, ${lit}%, 0.1)`;
    // this.shadowBlur = 2;

    this.speed = 1;
    this.generation = 0;
    this.distance = 0;
};

Branch.prototype = {
    // 主要的处理过程发生在这里
    process() {
        // 在当前的坐标处画出一个圆形
        this.draw();
        // 把当前的branch继续向上延伸一部分
        this.iterate();
        this.split();
        this.die();
    },

    draw() {
        const context = this.context;
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

    iterate() {
        const deltaX = this.speed * Math.cos(this.angle);
        const deltaY = -this.speed * Math.sin(this.angle);

        // 利用speed控制需要向上延伸的距离
        this.x += deltaX;
        this.y += deltaY;
        // 根据当前是第几代，减小半径值
        this.radius *= (0.99 - this.generation / 250);

        // 求出距离的增量
        const deltaDistance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

        // distance指的是当前的这一段树枝的长度
        this.distance += deltaDistance;

        // 控制speed的大小，使绘图时不至于在两个圆之间出现空白
        if (this.speed > this.radius * 2) {
            this.speed = this.radius * 2;
        }

        // 产生一个范围在（-0.1, 0.1)之间的随机数,对角度进行一个偏转
        this.angle += Math.random() / 5 - 1 / 5 / 2;
    },

    split() {
        let splitChance = 0;
        // 树干部分，长度大于画面高度1/5时开始分叉
        if (this.generation == 1) { splitChance = this.distance / halfHeight - 0.2; }
        // 树枝部分
        else if (this.generation < 3) { splitChance = this.distance / halfHeight - 0.1; }

        if (Math.random() < splitChance) {
            // 下一代生成n个树枝
            const n = 2 + Math.round(Math.random() * 3);
            for (let i = 0; i < n; i++) {
                const branch = new Branch();
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

    die() {
        if (this.radius < 0.5) {
            branches.remove(this);
        }
    },
};

const BranchCollection = function () {
    this.branches = [];
    this.canvas = canvas;
};

BranchCollection.prototype = {
    add(branch) {
        this.branches.push(branch);
    },

    // 依次处理集合内的每一个元素
    process() {
        for (const b in this.branches) {
            this.branches[b].process();
        }
    },

    remove(branch) {
        for (const b in this.branches) {
            if (this.branches[b] === branch) { this.branches.splice(b, 1); }
        }
    },
};


export const addTree = (image) => {
    return new Promise((resolve) => {
        image.getBuffer(Jimp.MIME_PNG, (error, buffer) => {
            canvas = new Canvas(image.bitmap.width, image.bitmap.height);
            // const ctx = canvas.getContext('2d');
            branches = new BranchCollection();
            const n = 2 + Math.random() * 3;

            for (let i = 0; i < n; i++) {
                const branch = new Branch();
                // branch.x = startX - initialRadius + i * 2 * initialRadius / n;
                branch.radius = initialRadius;
                branches.add(branch);
            }

            while (branches.branches.length > 0) branches.process();

            Jimp.read(canvas.toBuffer(), (err, result) => {
                resolve(image.composite(result, 0, 0));
            });
        });
    });
};

