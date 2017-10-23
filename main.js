// 第一关
// 敢死队突袭飞机 发散、暂停后撤退飞机 一个或多个子弹
// BOSS  不撤退飞机
// 第二关 追踪
// 突袭飞机 发散、暂停后撤退飞机 命数不同 一个或多个子弹
// BOSS  不撤退飞机
// 缓慢回退飞机 敢死队追踪

var __main = function () {
    var images = {
        // 'startScene': 'image/startScene.png',
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
        this.scene = new StartScene(game)
        // this.scene.draw()
    })
}

__main()
