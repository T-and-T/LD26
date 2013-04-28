function Entity(level) {
    this.game = null;
    this.location = null;
    this.time = 100;
    this.level = level;
    this.moving = -1; // not moving
    this.timeMoved = 0;
}

Entity.prototype.move = function(direction) {
    console.log("move!");
}

Entity.prototype.update = function() {}

Entity.prototype.die = function() {}