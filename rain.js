'use strict'

const ScreenSize = {
    WIDTH: 800,
    HEIGHT: 500
}

let getRandomValue = function (min, max) {
    return Math.random() * (max - min) + min;
};

let Raindrop = function () {
    this._reset();
};

Raindrop.prototype._reset = function () {
    this.size = getRandomValue(1, 6);

    this.x = getRandomValue(-ScreenSize.WIDTH, ScreenSize.WIDTH * 1);
    this.y = getRandomValue(-ScreenSize.HEIGHT, 0);

    this.velocity = this.size;
    this.hVelocity = this.size / 3;
}

Raindrop.prototype.render = function (ctx) {
       
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y - this.size);
    ctx.closePath();
    ctx.stroke();
};

Raindrop.prototype.update = function () {    
    this.x += this.hVelocity;
    this.y += this.velocity;

    if (this.isOffscreen()) {
        this._reset();
    }
};

Raindrop.prototype.isOffscreen = function () {
    return this.y > ScreenSize.HEIGHT + this.size ||
        this.x > ScreenSize.WIDTH + this.size ||
        this.x < -this.size;
};


let Snow = function () {
    Raindrop.call(this);
}

Snow.prototype = Object.create(Raindrop.prototype);

Snow.prototype.render = function(ctx){
    ctx.fillStyle = 'white';
    ctx.beginPath();
    
    ctx.ellipse(this.x, this.y, this.size, this.size, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

Snow.prototype.update = function () {
    Raindrop.prototype.update.call(this);
    this.angle += 0.01;
}

Snow.prototype._reset = function () {
    Raindrop.prototype._reset.call(this);
    this.angle = getRandomValue(0, Math.PI * 2);
};

let cleanupFrame = function (ctx) {
    ctx.clearRect(0, 0, ScreenSize.WIDTH, ScreenSize.HEIGHT);
}

let renderFrame = function (ctx, raindrops) {
    cleanupFrame(ctx);

    raindrops.forEach(function (it) {
        it.render(ctx);
        it.update();
    });
    requestAnimationFrame(renderFrame.bind(null, ctx, raindrops));
}

let setup = function () {
    const DROPS = 1000;
    const CUCUMBER_RATIO = 0.1;
    let canvas = document.querySelector('#rain');
    let ctx = canvas.getContext('2d');

    canvas.width = ScreenSize.WIDTH;
    canvas.height = ScreenSize.HEIGHT;

    let raindrops = new Array(DROPS * (1 - CUCUMBER_RATIO))
        .fill('')
        .map(function () {
            return new Raindrop();
        })
        .concat(new Array(DROPS * CUCUMBER_RATIO)
            .fill('')
            .map(function () {
                return new Snow();
            })
        );
    renderFrame(ctx, raindrops);
}

setup();