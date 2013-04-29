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

    this.updateHandlers = [];
    this.collide = function(){};

    // variable to hold the "thread"
    this.interval = null;

    // two dimensional array representing the grid
    this.grid = [];

    // one dimensional array holding all entities
    this.entities = [];

    this.keysdown = {};

    var that = this;

    document.onkeydown = function(e) {
        //console.log("Keydown: " + e.keyCode);
        that.keysdown[e.keyCode] = true;
    };

    document.onkeyup = function(e) {
        //console.log("Keyup: " + e.keyCode);
        that.keysdown[e.keyCode] = false;
    };

    for (var i = 0; i < rows; i++) {
        this.grid.push([]);
        for (var j = 0; j < cols; j++) {
            this.grid[i].push(null);
        }
    }
}

Game.prototype.update = function() {
    for (var i = 0; i < this.entities.length; i++) {
        var ent = this.entities[i];
        if (ent.moving == -1) {
            ent.update();
        } else if (ent.timeMoved < ent.time) {
            ent.timeMoved++;
        } else {
            this.moveEntity(ent, ent.moving);
            ent.moving = -1;
            ent.timeMoved = 0;
        }
    }

    for (var i = 0; i < this.updateHandlers.length; i++) {
        this.updateHandlers[i]();
    }
    this.render();
}

Game.prototype.render = function() {
    this.ctx.fillStyle = "rgb(255,255,255)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "rgb(0,0,0)";
    
    var moving_entity_queue = [];
    
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[0].length; j++) {
            var ent = this.grid[i][j];
            if (ent != null) {

                if (ent.moving == -1) {
                    this.ctx.save();
                    var clr = ent.getColor();
                    this.ctx.fillStyle = "rgb(" + clr.r + "," + clr.g + "," + clr.b + ")";
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

        var clr = ent.getColor();
        this.ctx.fillStyle = "rgb(" + clr.r + "," + clr.g + "," + clr.b + ")";

        var w = (this.width / this.cols);
        var h = (this.height / this.rows);
        var x = ent.location.x * w;
        var y = ent.location.y * h;

        var factor = (ent.timeMoved / ent.time);

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
    
    this.ctx.strokeRect(0, 0, this.width, this.height);
}

/// publicly documented methods

Game.prototype.start = function() {
    var that = this;
    this.interval = setInterval(function() {
        return that.update();
    }, 10);
}

Game.prototype.setSoundtrack = function(file) {}

Game.prototype.keyPressed = function(key) {
    return this.keysdown[key];
}

Game.prototype.mouseWasClicked = function() {
    // TODO: add queue or something
    return false;
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
}

Game.prototype.removeEntity = function(entity) {
    this.grid[entity.location.y][entity.location.x] = null;
    this.entities.splice(this.entities.indexOf(entity));
}
