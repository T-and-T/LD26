function Entity(level) {
    this.game = null;
    this.location = null;
    this.speed = 100;
    this.level = level;
}

Entity.prototype.move = function(direction) {
    console.log("move!");
}

Entity.prototype.update = function() {}

Entity.prototype.die = function() {}