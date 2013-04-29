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
    var colors =  [{r: 200, g: 0, b: 0},
                   {r: 220, g: 100, b: 0},
                   {r: 240, g: 200, b: 0},
                   {r: 198, g: 235, b: 10},
                   {r: 40, g: 200, b: 50},
                   {r: 60, g: 190, b: 170},
                   {r: 80, g: 140, b: 200},
                   {r: 120, g: 110, b: 180},
                   {r: 160, g: 80, b: 200},
                   {r: 200, g: 40, b: 200}];
    if (this.level < colors.length) {
        return colors[this.level];
    } else {
        return colors[colors.length - 1];
    }
}