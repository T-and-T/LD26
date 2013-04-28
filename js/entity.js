function Entity(level) {
    this.game = null;
    this.location = null;
    this.time = 50;
    this.level = level;
    this.moving = -1; // not moving
    this.timeMoved = 0;
}

Entity.prototype.move = function(direction) {
    if (this.game.validLocation(this.game.adjacentLocation(this.location, direction))) {
       this.moving = direction;
       this.timeMoved = 0;
   }
}

Entity.prototype.update = function() {}

Entity.prototype.die = function() {}