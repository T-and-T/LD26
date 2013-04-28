function AIEntity() {}

AIEntity.prototype = new Entity(1); // inherit from Entity and set level to 1

AIEntity.prototype.update = function() {}

AIEntity.prototype.die = function() {}