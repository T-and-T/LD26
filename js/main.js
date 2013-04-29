window.onload = function() {
    var game = new Game("game", 640, 480, 10, 10);

    game.onUpdate(function() {
        document.getElementById("score").innerHTML = game.score;
    });

    game.onCollide(function(entity1, entity2, location) {
        /*
         * either do nothing, leaving both entities in their
         * original positions, or remove one entity and move
         * the other entity into its space
         */
	if (entity1.level < entity2.level || (entity1.level == entity2.level && Math.random() <= 0.5)) {
	    if (Object.is(entity2, game.player) || Object.is(entity1, game.player))
		entity1.die();
	    else
		game.removeEntity(entity1);
	    entity2.location = location;
	}
	else { // if entity1 has the higher level, or they're equal and the coin-flip went the other way
	    if (Object.is(entity1, game.player) || Object.is(entity2, game.player))
		entity2.die()
	    else
		game.removeEntity(entity2);
	    entity1.location = location;
	}
    });

    var player = new PlayerEntity();
    game.addEntity(player, {x: bin1_2(game.cols - 1), y: bin1_2(game.rows - 1)});
    game.player = player;
   
    var mob = new AIEntity(2, 1);
    game.addEntity(mob, {x: 2, y:2});
    var mob1 = new AIEntity(1,3);
    game.addEntity(mob1, {x: 5, y: 2});

    game.start();
};