var __main = function () {
    var images = {
        'player': 'image/player.png',
        'bullet': 'image/bullet.png',
        'background': 'image/background.jpg',
        'enemy': 'image/enemy.png',
    }

    var game = new Game(30, images, function (game) {
        this.scene = new MainScene(game)
    })
}

__main()
