function AIEntity(game, level, direction) {
    this.game = game;
    this.timer = 0;
    this.level = level;
    this.time = level * 100;
    this.direction = direction;
    this.moving = direction;
}

AIEntity.prototype = new Entity(1); // inherit from Entity and set level to 1

AIEntity.prototype.update = function() {
    this.moving = this.direction;
}

AIEntity.prototype.die = function() {}