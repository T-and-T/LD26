function Entity(level) {
    this.game = null;
    this.location = null;
    this.time = 50;
    this.level = level;
    this.moving = -1; // not moving
    this.timeMoved = 0;
    this.canFallOff = true;
}

Entity.prototype.move = function(direction) {
    if (this.game.validLocation(this.game.adjacentLocation(this.location, direction)) || this.canFallOff) {
       this.moving = direction;
       this.timeMoved = 0;
   }
}

Entity.prototype.update = function() {}

Entity.prototype.die = function() {}

Entity.prototype.getColor = function() {
    return {r: 200, g: 0, b: 0};
}