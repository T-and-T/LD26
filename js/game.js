function Game(id, width, height, rows, cols) {
    var placeholder = document.getElementById(id);
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    placeholder.parentNode.replaceChild(canvas, placeholder);
    this.ctx = this.canvas.getContext("2d");
    this.rows = rows;
    this.cols = cols;
    this.score = 0;
}

Game.prototype.start = function() {}

Game.prototype.setSoundtrack = function(file) {}

Game.prototype.wasKeyPressed = function(key) {}

Game.prototype.wasMouseClicked = function() {}

Game.prototype.onUpdate = function(callback) {}

Game.prototype.onCollide = function(callback) {}

Game.prototype.addEntity = function(entity, location) {}

Game.prototype.moveEntity = function(entity, direction, speed) {}

Game.prototype.removeEntity = function(entity) {}