var __main = function () {
    var images = {
        'player': 'player.png',
        'bullet': 'bullet.png',
    }

    var game = new Game(images, function (game) {
        // log(this)
        this.scene = new MainScene(game)
        // return Scene(game)
    })
}

__main()
