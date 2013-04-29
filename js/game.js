function Game(id, width, height, rows, cols) {
    var placeholder = document.getElementById(id);
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    placeholder.parentNode.replaceChild(this.canvas, placeholder);
    this.ctx = this.canvas.getContext("2d");
    this.rows = rows;
    this.cols = cols;
    this.border = 4;
    this.score = 0;
    this.lives = 3;
    this.ticks = 0;
    this.state = this.stateEnum.STARTSCREEN;
    this.introTime = 0;
    this.single_col_time = 100;
    this.stagger = 10;

    /// Images

    this.startscreen = null;

    this.updateHandlers = [];
    this.collide = function(){};

    // variable to hold the "thread"
    this.interval = null;

    // two dimensional array representing the grid
    this.grid = [];

    // one dimensional array holding all entities
    this.entities = [];
    // handy shortcut to player, who is also in entities
    this.player = undefined;

    this.keysdown = {};
    this.click = false;

    var that = this;

    document.onkeydown = function(e) {
        //console.log("Keydown: " + e.keyCode);
        that.keysdown[e.keyCode] = true;
    };

    document.onkeyup = function(e) {
        //console.log("Keyup: " + e.keyCode);
        that.keysdown[e.keyCode] = false;
    };

    this.canvas.onmouseup = function(e) {
        that.click = {x: e.clientX, y: e.clientY};
    }

    for (var i = 0; i < rows; i++) {
        this.grid.push([]);
        for (var j = 0; j < cols; j++) {
            this.grid[i].push(null);
        }
    }

    this.load();
}

Game.prototype.stateEnum = {
    STARTSCREEN: 0,
    PLAY: 1,
    OVER: 2
};

Game.prototype.loadImage = function(filename) {
    var img = new Image();
    img.src = filename;
    return img;
}

Game.prototype.load = function() {
    this.startscreen = this.loadImage("images/splash.png");
}

Game.prototype.update = function() {
    switch (this.state) {
        case this.stateEnum.INTRO:
            var col_length = this.single_col_time + this.stagger * (this.cols - 1);
            var row_length = this.single_col_time + this.stagger * (this.rows - 1);
            var anim_length = Math.max(col_length, row_length);
            if (this.introTime < anim_length) {
                this.introTime++;
            } else {
                this.introTime = 0;
                this.state = this.stateEnum.PLAY;
            }
            break;
        case this.stateEnum.PLAY:
            for (var i = 0; i < this.entities.length; i++) {
                var ent = this.entities[i];
                if (ent.moving == -1) {
		    if (!Object.is(ent, this.player))
			console.log(i);
                    ent.update();
                } else if (ent.timeMoved < ent.getTime()) {
                    ent.timeMoved++;
                } else {
                    this.moveEntity(ent, ent.moving);
                    ent.moving = -1;
                    ent.timeMoved = 0;
                }
            }
            break;
    }

    for (var i = 0; i < this.updateHandlers.length; i++) {
        this.updateHandlers[i]();
    }

    this.render();

    this.ticks++;
}

Game.prototype.calculateColor = function(entity) {
    var time_for_anim = 30;
    var clr;
    if (entity.levelFrames == null) {
        clr = entity.getColor();
    } else {
        entity.level--;
        var old_clr = entity.getColor();
        entity.level++;
        var new_clr = entity.getColor();

        var factor = scaled_sin(entity.levelFrames / time_for_anim);

        clr = {r: Math.round((new_clr.r - old_clr.r) * factor + old_clr.r),
               g: Math.round((new_clr.g - old_clr.g) * factor + old_clr.g),
               b: Math.round((new_clr.b - old_clr.b) * factor + old_clr.b)};

        if (entity.levelFrames == time_for_anim) {
            entity.levelFrames = null;
        } else {
            entity.levelFrames++;
        }
    }

    return clr;
}

Game.prototype.setColor = function(entity) {
    var clr = this.calculateColor(entity);
    this.ctx.fillStyle = "rgb(" + clr.r + "," + clr.g + "," + clr.b + ")";
}

Game.prototype.setColorDarkened = function(entity, factor) {
    var clr = this.calculateColor(entity);
    var hsv = RGBtoHSV(clr);
    var scale = -(0.5 * Math.sin(-.5 * Math.PI + factor * 2 * Math.PI) - .5);
    hsv.v *= (3 + scale) / 4;
    clr = HSVtoRGB(hsv);
    this.ctx.fillStyle = "rgb(" + clr.r + "," + clr.g + "," + clr.b + ")";
}

Game.prototype.introRender = function() {
    var w = (this.width / this.cols);
    var h = (this.height / this.rows);
    
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[0].length; j++) {
            var ent = this.grid[i][j];

            if (ent != null) {
                var scale_y = (this.introTime - (j - 1) * this.stagger) / this.single_col_time;

                if (scale_y < 1 && scale_y >= 0)
                    scale_y = scaled_sin(scale_y);
                else if (scale_y < 1)
                    scale_y = 0;
                else
                    scale_y = 1;

                var y = this.height * scale_y;
                var my_y = h * j
                if (my_y <= y) {
                    this.ctx.save();
                    this.setColor(ent);
                    var mw = mh = (y - my_y) / 2;
                    if (mw > w) mw = w;
                    if (mh > h) mh = h;
                    mw = scaled_sin(mw / w) * w;
                    mh = scaled_sin(mh / h) * h;
                    this.ctx.fillRect(j * w, i * h, mw, mh);
                    this.ctx.restore();
                }
            }
        }
    }
    for (var i = 1; i < this.cols; i++) {
        var x = (this.width / this.cols) * i - this.border / 2;
        var scale = (this.introTime - (i - 1) * this.stagger) / this.single_col_time;

        if (scale < 1 && scale >= 0)
            scale = scaled_sin(scale);
        else if (scale < 1)
            scale = 0;
        else
            scale = 1;

        var y = this.height * scale - this.height;
        this.ctx.fillRect(x, y, this.border, this.height);
    }

    for (var i = 1; i < this.rows; i++) {
        var y = (this.height / this.rows) * i - this.border / 2;
        var scale = (this.introTime - (i - 1) * this.stagger) / this.single_col_time;

        if (scale < 1 && scale >= 0)
            scale = scaled_sin(scale);
        else if (scale < 1)
            scale = 0;
        else
            scale = 1;

        var x = this.width * scale - this.width;
        this.ctx.fillRect(x, y, this.width, this.border);
    }
};

Game.prototype.inPlayRender = function() {
    
    var moving_entity_queue = [];
    
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[0].length; j++) {
            var ent = this.grid[i][j];
            if (ent != null) {

                if (ent.moving == -1) {
                    this.ctx.save();
                    this.setColor(ent);
                    var w = (this.width / this.cols);
                    var h = (this.height / this.rows);
                    this.ctx.fillRect(ent.location.x * w, ent.location.y * h, w, h);
                    this.ctx.restore();
                } else {
                    moving_entity_queue.push(ent);
                }
            }
        }
    }
    
    // TODO: animate borders
    
    for (var i = 1; i < this.rows; i++) {
        var y = (this.height / this.rows) * i - this.border / 2;
        this.ctx.fillRect(0, y, this.width, this.border);
    }
    
    for (var i = 1; i < this.cols; i++) {
        var x = (this.width / this.cols) * i - this.border / 2;
        this.ctx.fillRect(x, 0, this.border, this.height);
    }
    
    for (var i = 0; i < moving_entity_queue.length; i++) {
        this.ctx.save();

        var ent = moving_entity_queue[i];
        var factor = (ent.timeMoved / ent.getTime());

        this.setColorDarkened(ent, factor);

        var w = (this.width / this.cols);
        var h = (this.height / this.rows);
        var x = ent.location.x * w;
        var y = ent.location.y * h;

        var point1, point2, point3, point4;

        switch (ent.moving) {
            case 0: // north
                var sin = y - scaled_sin(factor) * 2 * h + h;

                point1 = {x: x, y: y};
                point2 = {x: x + w, y: y};
                point3 = {x: circle_scale(x + w, sin, this.width, this.height, factor) + (x+w), y: sin};
                point4 = {x: circle_scale(x , sin, this.width, this.height, factor) + (x), y: sin};

                break;
            case 1: // east
                var sin = x + scaled_sin(factor) * 2 * w;

                point1 = {x: x + w, y: y};
                point2 = {x: x + w, y: y + h};
                point3 = {x: sin, y: circle_scale(y + h, sin, this.height, this.width, factor) + (y+h)};
                point4 = {x: sin, y: circle_scale(y, sin, this.height, this.width, factor) + (y)};

                break;
            case 2: // south
                var sin = y + scaled_sin(factor) * 2 * h;

                point1 = {x: x, y: y + h};
                point2 = {x: x + w, y: y + h};
                point3 = {x: circle_scale(x + w, sin, this.width, this.height, factor) + (x+w), y: sin};
                point4 = {x: circle_scale(x, sin, this.width, this.height, factor) + (x), y: sin};

                break;
            case 3: // west
                var sin = x - scaled_sin(factor) * 2 * w + w;

                point1 = {x: x, y: y};
                point2 = {x: x, y: y + h};
                point3 = {x: sin, y: circle_scale(y + h, sin, this.height, this.width, factor) + (y+h)};
                point4 = {x: sin, y: circle_scale(y, sin, this.height, this.width, factor) + (y)};

                break;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.lineTo(point3.x, point3.y);
        this.ctx.lineTo(point4.x, point4.y);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.lineWidth = this.border;
        this.ctx.stroke();

        this.ctx.restore();
    }
}

Game.prototype.render = function() {
    this.ctx.save();

    this.ctx.fillStyle = "rgb(255,255,255)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "rgb(0,0,0)";

    switch (this.state) {
        case this.stateEnum.STARTSCREEN:
            this.ctx.drawImage(this.startscreen, 0, 0);
            break;
        case this.stateEnum.INTRO:
            this.introRender();
            break;
        case this.stateEnum.PLAY:
            this.inPlayRender();
            break;
        case this.stateEnum.OVER:
            // show over screen, "Do you want to play again?"
            break;
    }

    this.ctx.restore();
    this.ctx.strokeRect(0, 0, this.width, this.height);
}

/// publicly documented methods

Game.prototype.start = function() {
    this.state = this.stateEnum.STARTSCREEN;
    var that = this;
    this.interval = setInterval(function() {
        return that.update();
    }, 10);
}

Game.prototype.stop = function() {
    clearInterval(this.interval);
}

Game.prototype.setSoundtrack = function(file) {}

Game.prototype.keyPressed = function(key) {
    return this.keysdown[key];
}

Game.prototype.mouseWasClicked = function() {
    if (this.click) {
        var r = this.click;
        this.click = false;
        return r;
    } else
        return false;
}

Game.prototype.getTicks = function() {
    return this.ticks;
}

Game.prototype.onUpdate = function(callback) {
    this.updateHandlers.push(callback);
}

Game.prototype.onCollide = function(callback) {
    this.collide = callback;
}

Game.prototype.addEntity = function(entity, location) {
    if (this.grid[location.y][location.x] == null) {
        this.grid[location.y][location.x] = entity;
        entity.location = {x: location.x, y: location.y};
        entity.game = this;

        this.entities.push(entity);
        return true;
    } else {
        return false;
    }
}

Game.prototype.validLocation = function(location) {
    return location.x >= 0 && location.x < this.cols && location.y >= 0 && location.y < this.rows;
}

Game.prototype.adjacentLocation = function(location, dir) {
    var loc = {x: location.x, y: location.y};

    switch (dir) {
        case 0: // north
            loc.y--;
            break;
        case 1: // east
            loc.x++;
            break;
        case 2: // south
            loc.y++;
            break;
        case 3: // west
            loc.x--;
            break;
    }

    return loc;
}


Game.prototype.moveEntity = function(entity, direction) {
    if (this.entities.indexOf(entity) > -1) {
        var loc = this.adjacentLocation(entity.location, direction);

        if (this.validLocation(loc)) {
            if (this.grid[loc.y][loc.x] == null) {
                this.grid[entity.location.y][entity.location.x] = null;
                this.grid[loc.y][loc.x] = entity;
                entity.location = loc;
            } else {
                return this.collide(entity, this.grid[loc.y][loc.x], loc);
            }
        } else if (entity.canFallOff) {
            this.removeEntity(entity);
        } else {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

Game.prototype.removeEntity = function(entity) {
    this.grid[entity.location.y][entity.location.x] = null;
    this.entities = this.entities.splice(this.entities.indexOf(entity));
}

Game.prototype.gameOver = function() {
    this.state = this.stateEnum.OVER;
}
