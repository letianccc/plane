var __main = function () {
    var images = {
        'player': 'player.png',
        'bullet': 'bullet.png',
    }

    var game = Game(images, function (game) {
        return Scene(game)
    })
}

__main()