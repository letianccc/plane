var __main = function () {
    var images = {
        'player': 'image/player.png',
        'playerBullet': 'image/playerBullet.png',
        'enemyBullet': 'image/enemyBullet.png',
        'fireBullet': 'image/fireBullet.png',
        'background': 'image/background.jpg',
        'enemy': 'image/enemy.png',
        'enemy1': 'image/enemy1.png',
        'spark': 'image/spark.png',
        'buff': 'image/buff.gif',
        'boss': 'image/boss.gif',
    }

    var game = new Game(30, images, function (game) {
        this.scene = new MainScene(game)
    })
}

__main()
