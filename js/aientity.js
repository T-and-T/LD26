function AIEntity(level, direction) {
    this.timer = 0;
    this.level = level;
    this.time = (level+1) * 100;
    this.direction = direction;
}

AIEntity.prototype = new Entity(1); // inherit from Entity and set level to 1

AIEntity.prototype.update = function() {
    this.move(this.direction);
}

AIEntity.prototype.die = function() {
    this.game.player.stomach += 1 + this.level;
    this.game.score += 1 + this.level;
    this.game.removeEntity(this);
}