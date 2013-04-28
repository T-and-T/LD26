function Game(id, width, height, rows, cols) {
    var placeholder = document.getElementById(id);
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    placeholder.parentNode.replaceChild(this.canvas, placeholder);
    this.ctx = this.canvas.getContext("2d");
    this.rows = rows;
    this.cols = cols;
    this.border = 10;
    this.score = 0;

    this.updateHandlers = [];
    this.collisionHandlers = [];

    // variable to hold the "thread"
    this.interval = null;

    this.grid = [];

    for (var i = 0; i < rows; i++) {
        this.grid.push([]);
        for (var j = 0; j < cols; j++) {
            this.grid[i].push(null);
        }
    }
}

Game.prototype.update = function() {
    for (var i = 0; i < this.updateHandlers.length; i++) {
        this.updateHandlers[0]();
    }
    this.render();
}

Game.prototype.render = function() {
    this.ctx.fillStyle = "rgb(255,255,255)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "rgb(0,0,0)";
    
    // TODO: animate borders
    
    for (var i = 0; i < this.rows; i++) {
        this.ctx.fillRect(0, (this.height / this.rows) * i, this.width, this.border);
    }
    
    for (var i = 0; i < this.cols; i++) {
        this.ctx.fillRect((this.height / this.rows) * i, 0, this.border, this.height);
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

Game.prototype.wasKeyPressed = function(key) {
    // TODO: add queue or something
    return false;
}

Game.prototype.wasMouseClicked = function() {
    // TODO: add queue or something
    return false;
}

Game.prototype.onUpdate = function(callback) {
    this.updateHandlers.push(callback);
}

Game.prototype.onCollide = function(callback) {
    this.updateHandlers.push(callback);
}

Game.prototype.addEntity = function(entity, location) {
    console.log(this.grid);
    if (this.grid[location.x][location.y] == null) {
        this.grid[location.x][location.y] = entity;
        return true;
    } else {
        return false;
    }
}

Game.prototype.moveEntity = function(entity, direction, speed) {}

Game.prototype.removeEntity = function(entity) {}
