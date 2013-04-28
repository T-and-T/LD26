window.onload = function() {
    var game = new Game("game", 640, 480, 10, 10);

    game.onUpdate(function() {
        // pass
    });

    game.onCollide(function(entity1, entity2, location) {
        /*
         * either do nothing, leaving both entities in their
         * original positions, or remove one entity and move
         * the other entity into its space
         */
    });

    var player = new PlayerEntity();

    // TODO: make the location slightly randomized
    // Taneb go all math on it
    game.addEntity(player, {x: Math.round(game.width / 2), y: Math.round(game.height / 2)});

    game.start();
};