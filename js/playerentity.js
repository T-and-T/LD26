function PlayerEntity() {}

PlayerEntity.prototype = new Entity(1); // inherit from Entity and set level to 1

PlayerEntity.prototype.update = function() {}

PlayerEntity.prototype.die = function() {}