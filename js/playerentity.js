function PlayerEntity() {}

PlayerEntity.prototype = new Entity(1); // inherit from Entity and set level to 1

PlayerEntity.prototype.update = function() {

    if (this.game.keyPressed(38)) { // north
        this.move(0);
    } else if (this.game.keyPressed(39)) { // east

    } else if (this.game.keyPressed(40)) { // south

    } else if (this.game.keyPressed(37)) { // west

    }

}

PlayerEntity.prototype.die = function() {}