function PlayerEntity() {
    this.canFallOff = false;
    this.stomach = 0;
}

PlayerEntity.prototype = new Entity(1); // inherit from Entity and set level to 1

PlayerEntity.prototype.update = function() {
    if (this.stomach >= triangle(this.level + 1) + 2)
	this.level += 1;
    if (this.game.keyPressed(38)) { // north
        this.move(0);
    } else if (this.game.keyPressed(39)) { // east
	this.move(1);
    } else if (this.game.keyPressed(40)) { // south
	this.move(2);
    } else if (this.game.keyPressed(37)) { // west
	this.move(3);
    }

}

PlayerEntity.prototype.die = function() {}

PlayerEntity.prototype.getColor = function() {
    var clr = Entity.prototype.getColor.call(this);

    // increase saturation
    var hsv = RGBtoHSV(clr);

    hsv.s = 1;
    hsv.v = 1;

    clr = HSVtoRGB(hsv);

    return clr;
}
