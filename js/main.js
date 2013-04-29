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
    });

    var player = new PlayerEntity();
    game.addEntity(player, {x: bin1_2(game.cols - 1), y: bin1_2(game.rows - 1)});
    game.player = player;
    var mob = new AIEntity(2, 2);
    game.addEntity(mob, {x: 0, y: 1});

    game.start();
};