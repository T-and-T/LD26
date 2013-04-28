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
    
    // TODO: add state for moving entity
    
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[0].length; j++) {
            var ent = this.grid[i][j];
            if (ent != null) {
                // TODO: base on level
                this.ctx.save();
                this.ctx.fillStyle = "rgb(200,0,0)";

                if (ent.moving == -1) {
                    var w = (this.width / this.cols);
                    var h = (this.height / this.rows);
                    this.ctx.fillRect(ent.location.x * w, ent.location.y * h, w, h);
                } else {
                    var w = (this.width / this.cols);
                    var h = (this.height / this.rows);
                    var x = ent.location.x * w;
                    var y = ent.location.y * h;

                    switch (ent.moving) {
                        case 0: // north
                            y -= ent.timeMoved / ent.time * h;
                            break;
                        case 1: // east
                            x += ent.timeMoved / ent.time * w;
                            break;
                        case 2: // south
                            y += ent.timeMoved / ent.time * h;
                            break;
                        case 3: // west
                            x -= ent.timeMoved / ent.time * w;
                            break;
                    }

                    this.ctx.fillRect(x, y, w, h);
                }

                this.ctx.restore();
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
            this.grid[entity.location.y][entity.location.x] = null;
            this.entities.splice(this.entities.indexOf(entity));
        } else {
            return false;
        }
    } else {
        return false;
    }
}

Game.prototype.removeEntity = function(entity) {}
