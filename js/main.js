var player;
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

    /*var */player = new PlayerEntity();
    game.addEntity(player, {x: bin1_2(game.cols - 1), y: bin1_2(game.rows - 1)});
    game.player = player;
    /// view color scheme (remove this code when you've seen the scheme)
    for (var i = 0; i < 10; i++) {
        var m = new Entity(i);
        game.addEntity(m, {x: i, y: 1});
    }

    game.start();
};