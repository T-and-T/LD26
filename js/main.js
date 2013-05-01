window.onload = function() {

    var game = newGame();

    game.start();

    game.onUpdate(function() {
        if (game.state === game.stateEnum.STARTSCREEN && game.mouseWasClicked()) {
            game.state = game.stateEnum.INTRO;
            game.introTime = 0;
        } else if (game.state === game.stateEnum.OVER && game.mouseWasClicked()) {
            window.location.reload(false);
        } else if (game.state === game.stateEnum.PLAY) {
            var chance_per_level = [ // measured in 10 percents
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // won't ever be at this level
                [15, 10, 5, 3, 2, 1, 0, 0, 0, 0],
                [10, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                [6, 7, 8, 7, 6, 5, 4, 3, 2, 1],
                [5, 6, 7, 8, 7, 6, 5, 4, 3, 2],
                [4, 5, 6, 7, 8, 7, 6, 5, 4, 3],
                [3, 4, 5, 6, 7, 8, 7, 6, 5, 4],
                [2, 3, 4, 5, 6, 7, 8, 7, 6, 5],
                [1, 2, 3, 4, 5, 6, 7, 8, 7, 6],
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 7],
            ];
            var enemies_per_level = [0, 8, 9, 10, 11, 12, 14, 16, 18, 22];

            // the current enemies, sorted by level
            var current_enemies = [];
            var num_enemies = 0;

            for (var i = 0; i < 9; i++) {
                current_enemies[i] = game.countEnemiesOfLevel(i);
                num_enemies += current_enemies[i];
            }

            if (num_enemies < enemies_per_level[game.player.level]) {
                var total_pool = 0;
                for (var i = 0; i < chance_per_level[game.player.level].length; i++) {
                    total_pool += chance_per_level[game.player.level][i];
                }
                var chosen = Math.floor(Math.random() * (total_pool - 0 + 1)) + 0;
                for (var i = 0; i < chance_per_level[game.player.level].length; i++) {
                    chosen -= chance_per_level[game.player.level][i];
                    if (chosen <= 0) {
                        game.spawnMob(i);
                        break;
                    }
                }
            }
        }
        document.getElementById("score").innerHTML = game.score;
        document.getElementById("lives").innerHTML = game.lives;
        document.getElementById("level").innerHTML = player.level + 1;
    });

    game.onCollide(function(entity1, entity2, location) {
        /*
         * either do nothing, leaving both entities in their
         * original positions, or remove one entity and move
         * the other entity into its space
         */
	if (entity1.level < entity2.level || (entity1.level == entity2.level && Math.random() <= 0.5)) {
	    if (entity2 === game.player || entity1 === game.player)
		entity1.die();
	    else
		game.removeEntity(entity1);
	    entity2.location = location;
	}
	else { // if entity1 has the higher level, or they're equal and the coin-flip went the other way
	    if (entity1 === game.player || entity2 === game.player)
		entity2.die()
	    else
		game.removeEntity(entity2);
	    entity1.location = location;
	}
    });
    var player;
    function newGame() {
        var game = new Game("game", 640, 480, 10, 10);

        player = new PlayerEntity();
        game.addEntity(player, {x: bin1_2(game.cols - 1), y: bin1_2(game.rows - 1)});
        game.player = player;
   
        game.spawnMob(0);
        game.spawnMob(1);
        game.spawnMob(2);

        return game
    }
};