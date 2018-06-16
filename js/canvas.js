var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext('2d');

var SQ_SIZE = 100

var SQ_START = {
    x: (canvas.width-SQ_SIZE)/2,
    y: (canvas.height-SQ_SIZE)/2
}

var MAX_SPEED = 6;
var MEDIUM_SPEED = 4;
var LOW_SPEED = 1;
var NO_SPEED = 0;

var mouse = {
    x: undefined,
    y: undefined
};

window.onload = function() {
    animate();
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
}, false);

function Square(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = size;
    this.height = size;
    this.color = color;

    this.clearGlow = function() {
        context.shadowBlur = 0;
        context.shadowColor = "#FFFFFF";
    }

    this.drawGlowEdge = function() {
        if(this.dx != 0 || this.dy != 0) {
            context.beginPath();
            context.lineWidth = "10";
            context.strokeStyle = "#FFFFFF";
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 50;
            var shadowColor = undefined;
            if(this.dx != 0) {
                shadowColor = this.edgeShadowColor(Math.abs(this.dx));
            } else {
                shadowColor = this.edgeShadowColor(Math.abs(this.dy));
            }
            context.shadowColor = shadowColor;
            //console.log(this.dx, this.dy);

            if(this.dy > 0) {
                context.moveTo(this.x, this.y);
                context.lineTo(this.x + this.width, this.y);
            } else if (this.dy < 0){
                context.moveTo(this.x, this.y + this.height);
                context.lineTo(this.x + this.width, this.y + this.height);
            } else if(this.dx > 0) {
                context.moveTo(this.x, this.y);
                context.lineTo(this.x, this.y + this.height);
            } else if(this.dx < 0) {
                context.moveTo(this.x + this.width, this.y);
                context.lineTo(this.x + this.width, this.y + this.height);
            }
            context.stroke();
        }
    }

    this.edgeShadowColor = function(speed) {
        if (speed == MAX_SPEED) {
            return "#000080";
        } else if (speed == MEDIUM_SPEED) {
            return "#0000FF";
        } else if (speed == LOW_SPEED) {
            return "#00BFFF";
        } else if (speed == NO_SPEED) {
            return "#FFFFFF";
        }
    }

    this.draw = function () {
        context.clearRect(0, 0, innerWidth, innerHeight);
        context.fillStyle = this.color;
        //console.log(this.x, this.y, this.width, this.height);
        this.drawGlowEdge();
        this.clearGlow();
        context.fillRect(this.x, this.y, this.width, this.height);
        
    }

    this.update = function() {
        this.dx = this.dy = 0;
        if (mouse.y < this.y) {
            if (mouse.x >= this.x && mouse.x <= this.x+this.width) {
                this.dy = this.speed(this.y-mouse.y);
                //console.log(this.dy);
            } 
        } else if(mouse.y > this.y + this.height) {
            if (mouse.x >= this.x && mouse.x <= this.x + this.width) {
                this.dy = -this.speed(mouse.y - (this.y+this.height));
                //console.log(this.dy);
            }
        }
        if(mouse.x < this.x) {
            if (mouse.y >= this.y && mouse.y <= this.y+this.height) {
                this.dx = this.speed(this.x-mouse.x);
            }
        } else if(mouse.x > this.x + this.width) {
            if (mouse.y >= this.y && mouse.y <= this.y+this.height) {
                this.dx = -this.speed(mouse.x - (this.x+this.width));
                //console.log(this.dx);
            }
        }

        if (this.x + this.width > innerWidth || this.x < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.height > innerHeight || this.y < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
        //console.log(mouse.x, mouse.y, this.x, this.y);
        //console.log(this.dx, this.dy);

        this.draw();
    }

    this.speed = function(distance) {
        //console.log("distance", distance);
        if(distance <= 20) {
            return MAX_SPEED;
        } else if (distance <= 50) {
            return MEDIUM_SPEED;
        } else if (distance <= 100) {
            return LOW_SPEED;
        } else {
            return NO_SPEED;
        }
    }
}

var square = new Square(SQ_START.x, SQ_START.y, SQ_SIZE, '#FF0000');

function animate() {
    requestAnimationFrame(animate);
    square.update();
 }

