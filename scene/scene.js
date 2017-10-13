
var Scene = function (game) {
    var s = {
        g: game
    }

    var player = Player(game)

    var bullets = []

    game.register("ArrowUp", function () {
        player.moveUp()
    })
    game.register("ArrowDown", function () {
        player.moveDown()
    })
    game.register("ArrowLeft", function () {
        player.moveLeft()
    })
    game.register("ArrowRight", function () {
        player.moveRight()
    })
    game.register("f", function () {
        player.launch(bullets)
    })

    s.update = function () {
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].move()
        }
    }

    s.draw = function () {
        game.drawImage(player)
        for (var i = 0; i < bullets.length; i++) {
            game.drawImage(bullets[i])
        }
    }

    return s
}
