

class Scene {
    constructor(game) {
        this.game = game
        this.limitX = 500
        this.limitY = 500
        this.elements = {
            'Background': [],
            'Player': [],
            'Enemy': [],
            'Bullet': [],
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
        ctx.fillText("按s键开始游戏", this.limitX/2-80, this.limitY/2)
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
        this.player = new Player(game, this)

        // log(this.player)
        this.enemeyTime = 100
        this.timer = 0
        this.hasBoss = false

        this.registerEnemys = this.registerEnemysForFirstPass()

        this.addElement(this.bg1)
        this.addElement(this.bg2)
        this.addElement(this.player)
        this.init_listener()
    }

    update() {
        this.timer++

        if (this.boss.lives == 0) {
            this.registerEnemys = this.registerEnemysForSecondPass()
        }

        this.addEnemy()

        for (var imageKind of Object.keys(this.elements)) {
            for (var img of this.elements[imageKind]) {
                img.update()
            }
        }

        // this.test1()
        // var isTrace = true
        // var e = this.time(10, 'Boss1', this.limitX/2-60, isTrace)
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

    addEnemy() {
        log(this.registerEnemys)
        if (Object.keys(this.registerEnemys).length > 0) {
            var enemys = []
            for (var e of this.registerEnemys) {
                var time = this.registerEnemys[e]
                if (this.timer == time) {
                    enemys.push(e)
                }
            }

            for (var e of enemys) {
                this.addElement(e)
            }
            // 删除已注册的敌人的记录
            for (var e of enemys) {
                delete this.registerEnemys[e]
            }
        }
    }

    registerEnemysForFirstPass() {
        var isTrace = false
        var enemys = [
                    this.generateEnemy('ForlornHope', 20, isTrace),
                    this.generateEnemy('ForlornHope', 200, isTrace),
                    this.generateEnemy('ForlornHope', 300, isTrace),
                    this.generateEnemy('GeneralEnemy', 20, isTrace),
                    this.generateEnemy('GeneralEnemy', 350, isTrace),
                    this.generateEnemy('ForlornHope', 150, isTrace),
                    this.generateEnemy('ForlornHope', 250, isTrace),
                    this.generateEnemy('Enemy1', 200, isTrace),
                    this.generateEnemy('Enemy1', 30, isTrace),
                    this.generateEnemy('Boss1', this.limitX/2-60, isTrace),
                ]
        var times = [20, 30, 40, 120, 250, 350, 350, 400, 550, 900]
        var registerEnemys = {}
        for (var i = 0; i < times.length; i++) {
            var e = enemys[i]
            var t = times[i]
            registerEnemys[e] = t
            log(registerEnemys)
        }
        this.boss = enemys[enemys.length - 1]
        log(registerEnemys)
        return registerEnemys
    }

    registerEnemysForSecondPass() {}

    startFirstPass() {
        var isTrace = false
        // this.time(20, 'ForlornHope', 20, isTrace)
        // this.time(30, 'ForlornHope', 200, isTrace)
        // this.time(40, 'ForlornHope', 300, isTrace)
        // this.time(120, 'GeneralEnemy', 20, isTrace)
        // this.time(250, 'GeneralEnemy', 350, isTrace)
        // this.time(350, 'ForlornHope', 150, isTrace)
        // this.time(350, 'ForlornHope', 250, isTrace)
        // this.time(400, 'Enemy1', 200, isTrace)
        // this.time(550, 'Enemy1', 30, isTrace)

        // var boss = this.time(900, 'Boss1', this.limitX/2-60, isTrace)
        // log(boss)
        // if (this.timer > 900 && boss.lives == 0) {
        //
        //     // this.startSecondPass(this.timer+200)
        // }
        if (this.timer == 10) {
            this.boss = this.time(10, 'Boss1', this.limitX/2-60, isTrace)
        }
        if (this.timer > 110) {
            log(this.boss)
            if (this.boss.lives == 0) {
                this.startSecondPass(this.timer+200)
            }
        }

    }

    startSecondPass(timer) {
        var isTrace = true
        log('second')
        this.time(timer+20, 'ForlornHope', 40, isTrace)
        this.time(timer+30, 'ForlornHope', 150, isTrace)
        this.time(timer+40, 'ForlornHope', 200, isTrace)
        this.time(timer+120, 'GeneralEnemy', 50, isTrace)
        this.time(timer+250, 'GeneralEnemy', 180, isTrace)
        this.time(timer+350, 'Enemy1', 120, isTrace)
        this.time(timer+350, 'ForlornHope', 90, isTrace)
        this.time(timer+350, 'ForlornHope', 160, isTrace)
        this.time(timer+550, 'Enemy1', 220, isTrace)
        this.time(timer+1200, 'Boss1', this.limitX/2, isTrace)
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
            return this.generateEnemy(enemy, x, isTrace)
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

    generateEnemy(classname, x, isTrace=true) {

        // log('enemy')
        var y = -20
        // var k = getRandomInt(0, 10)
        // var isBuff = k == 9 ? true : false
        // var isBuff = true
        // var x1 = getRandomInt(5,135)
        var x1 = x
        // var w = 30
        // var h = 10
        var parameter = "this.game, this, \'enemy\', x1, y, isTrace"
        // var e1 = new GeneralEnemy(scene.game, scene, 'enemy', x1, y, isBuff)
        var e1 = eval("new " + classname + "(" + parameter + ")")
        // log("new " + classname + "(" + parameter + ")")
        // log(e1)
        // this.addElement(e1)
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
