

class Scene {
    constructor(game) {
        this.game = game
        this.limitX = 280
        this.limitY = 150
        this.elements = {
            'Background': [],
            'Bullet': [],
            'Player': [],
            'Enemy': [],
            'Boss': [],
            'Spark': [],
            'Buff': [],
        }
    }

    addElement(image) {
        var imageKind = image.constructor.name
        if (imageKind == 'Boss1' || imageKind == 'Enemy2' || imageKind == 'ForlornHope' || imageKind == 'GeneralEnemy' || imageKind == 'Boss' || imageKind == 'Enemy' || imageKind == 'Enemy1') {
            imageKind = 'Enemy'
        }
        if (imageKind == 'PlayerBullet' || imageKind == 'GeneralBullet' || imageKind == 'EnemyBullet' || imageKind == 'Bullet') {
            imageKind = 'Bullet'
        }
        if (imageKind == 'StartBackground' || imageKind == 'MainBackground') {
            imageKind = 'Background'
        }


        // log(image)
        this.elements[imageKind].push(image)
    }

    getImages(imageKind) {
        if (imageKind == 'Enemy2' || imageKind == 'ForlornHope' || imageKind == 'GeneralEnemy' || imageKind == 'Boss' || imageKind == 'Enemy' || imageKind == 'Enemy1') {
            imageKind = 'Enemy'
        }
        if (imageKind == 'PlayerBullet' || imageKind == 'EnemyBullet' || imageKind == 'Bullet') {
            imageKind = 'Bullet'
        }
        return this.elements[imageKind]
    }

    removeImage(img) {
        var imageKind = img.constructor.name
        if (imageKind == 'Boss1' || imageKind == 'Enemy2' || imageKind == 'ForlornHope' || imageKind == 'GeneralEnemy' || imageKind == 'Boss' || imageKind == 'Enemy' || imageKind == 'Enemy1') {
            imageKind = 'Enemy'
        }
        if (imageKind == 'PlayerBullet' || imageKind == 'GeneralBullet' || imageKind == 'EnemyBullet' || imageKind == 'Bullet') {
            imageKind = 'Bullet'
        }
        var images = this.elements[imageKind]
        var index = images.indexOf(img)
        images.splice(index, 1)
    }

    update() {
        for (var imageKind of Object.keys(this.elements)) {
            for (var img of this.elements[imageKind]) {
                img.update()
                // if (imageKind == 'Bullet'){
                //     log('update', img.y)
                // }
            }
        }
    }

    draw() {
        for (var imageKind of Object.keys(this.elements)) {
            for (var img of this.elements[imageKind]) {
                // log('t')
                this.game.drawImage(img)
                // if (imageKind == 'Bullet'){
                //     log('draw', img.y)
                // }
            }
        }
    }
}

class StartScene extends Scene{
    constructor(game) {
        super(game)
        this.bg = new StartBackground(game, this, 'background')
        this.addElement(this.bg)
        this.init_listener()
    }

    draw() {
        this.drawImage()
        this.drawText()
    }

    drawImage() {
        for (var imageKind of Object.keys(this.elements)) {
            for (var img of this.elements[imageKind]) {
                this.game.drawImage(img)
            }
        }
    }

    drawText() {
        var ctx = this.game.context
        ctx.font = '24px serif'
        ctx.fillStyle = 'White'
        ctx.fillText("按s键开始游戏", 50, 70)
    }

    init_listener() {
        var g = this.game
        this.game.register("s", function () {
            // o.game.start = true
            g.startMainScene()
        })
    }
}

class MainScene extends Scene{
    constructor(game) {
        // log('ms')
        super(game)
        this.bg1 = new MainBackground(game, this, 'background')
        this.bg2 = new MainBackground(game, this, 'background')
        this.bg1.y = 0
        this.bg2.y = -this.bg2.h
        this.player = new Player(game, this, 'player', 130, 120, 20, 20)

        log(this.player)
        this.enemeyTime = 100
        this.timer = 0
        this.hasBoss = false

        this.addElement(this.bg1)
        this.addElement(this.bg2)
        this.addElement(this.player)
        this.init_listener()
    }

    update() {
        // log('main')
        this.timer++
        // log('scene.timer', this.timer)
        for (var imageKind of Object.keys(this.elements)) {
            for (var img of this.elements[imageKind]) {
                img.update()
            }
        }

        // this.test1()
        var isTrace = true
        var e = this.time(10, 'Boss1', this.limitX/2, isTrace)
        // log(e)
        // log(this.elements)

        // this.startFirstPass()
        // this.startSecondPass()


        // if (this.timer == 10) {
        //     this.time(10, 'ForlornHope', 10)
        //     this.generateEnemy(this, 'ForlornHope', 40)
        //     this.generateEnemy(this, 'ForlornHope', 130)
        //     this.generateEnemy(this, 'ForlornHope', 230)
        // }
        // if (this.timer == 15)
        // if (this.timer == 30) {
        //     this.generateEnemy(this, 'GeneralEnemy', 60)
        //     this.generateEnemy(this, 'GeneralEnemy', 180)
        // }
        // var e = this.test('GeneralEnemy')

    }

    startFirstPass() {
        this.time(20, 'ForlornHope', 40)
        this.time(30, 'ForlornHope', 150)
        this.time(40, 'ForlornHope', 200)
        this.time(120, 'GeneralEnemy', 50)
        this.time(250, 'GeneralEnemy', 180)
        this.time(350, 'Enemy1', 120)
        this.time(350, 'ForlornHope', 90)
        this.time(350, 'ForlornHope', 160)
        this.time(550, 'Enemy1', 220)
        this.time(900, 'Boss1', this.limitX/2)

    }

    startSecondPass() {
        this.time(20, 'ForlornHope', 40)
        this.time(30, 'ForlornHope', 150)
        this.time(40, 'ForlornHope', 200)
        this.time(120, 'GeneralEnemy', 50)
        this.time(250, 'GeneralEnemy', 180)
        this.time(350, 'Enemy1', 120)
        this.time(350, 'ForlornHope', 90)
        this.time(350, 'ForlornHope', 160)
        this.time(550, 'Enemy1', 220)
        this.time(1200, 'Boss1', this.limitX/2)
    }

    test1() {
        var ySpeed = 3
        var imgName = 'enemyBullet'
        var w = 20
        var h = 20
        // var x = this.x + this.w / 2 - w / 2
        // var y = this.y + this.h
        var r = 10
        var x1 = 30 + 20 / 2
        var y1 = 30 + 20 / 2
        var x = x1 + r*Math.sin(30)
        var y = y1 + r*Math.cos(30)
        var target = 'Player'
        // log(x1)
        // var b = new PlayerBullet(this.game, this.scene, imgName, w, h, x, y, xSpeed, ySpeed, target)

        // var b = new EnemyBullet(this.game, this.scene, 'fireBullet', x, y, 0, this.bulletSpeed)
        var b1 = new GeneralBullet(this.game, this.scene, imgName, w, h, x, y, ySpeed, target)
        this.scene.addElement(b1)
        x = x1 + r*Math.sin(-30)
        y = y1 + r*Math.con(-30)
        var b = new GeneralBullet(this.game, this.scene, imgName, w, h, x, y, ySpeed, target)
        this.scene.addElement(b)
        log(b)
    }

    time(time, enemy, x, isTrace) {
        if (this.timer == time) {
            return this.generateEnemy(this, enemy, x, isTrace)
        }
    }

    test(className) {
        if (this.hasBoss == false) {
            var e = this.generateEnemy(this, className)
            this.hasBoss = true
        }
        return e

        // if (className == 'Enemy1'){
        //     if (this.timer >= 50) {
        //         if (this.hasBoss == false) {
        //             this.generateEnemy1(this)
        //             this.hasBoss = true
        //         }
        //     }
        // }
        // if (className == 'GeneralEnemy'){
        //     if (this.timer >= 50) {
        //         if (this.hasBoss == false) {
        //             this.generateGeneralEnemy(this)
        //             this.hasBoss = true
        //         }
        //     }
        // }

    }

    generateEnemy(scene, classname, x, isTrace=true) {

        // log('enemy')
        var y = -20
        // var k = getRandomInt(0, 10)
        // var isBuff = k == 9 ? true : false
        // var isBuff = true
        // var x1 = getRandomInt(5,135)
        var x1 = x
        // var w = 30
        // var h = 10
        var parameter = "scene.game, scene, \'enemy\', x1, y, isTrace"
        // var e1 = new GeneralEnemy(scene.game, scene, 'enemy', x1, y, isBuff)
        var e1 = eval("new " + classname + "(" + parameter + ")")
        // log("new " + classname + "(" + parameter + ")")
        // log(e1)
        scene.addElement(e1)
        // log(e1)
        return e1
    }

    generateBoss(scene) {
        // log('boss')
        scene.boss = new Boss(scene.game, scene, 'boss', 150, 1)
        // log(scene.boss)
        scene.addElement(scene.boss)
        // log(scene.elements)
    }

    init_listener() {
        // log(this)
        var p = this.player
        this.game.register("ArrowUp", function () {
                p.moveUp()

        })
        this.game.register("ArrowDown", function () {

                p.moveDown()

        })
        this.game.register("ArrowLeft", function () {
                p.moveLeft()
        })
        this.game.register("ArrowRight", function () {
                p.moveRight()

        })
        this.game.register("f", function () {
            p.attack()
        })
    }

}
