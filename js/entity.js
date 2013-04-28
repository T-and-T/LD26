function Entity(level) {
    this.game = null;
    this.location = null;
    this.speed = 100;
    this.level = level;
}

Entity.prototype.move = function(direction) {}

Entity.prototype.update = function() {}

Entity.prototype.die = function() {}