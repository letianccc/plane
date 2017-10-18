

class Scene {
    constructor(game) {
        this.game = game
        this.limitX = 280
        this.limitY = 130
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
        if (imageKind == 'GeneralEnemy' || imageKind == 'Boss' || imageKind == 'Enemy' || imageKind == 'Enemy1') {
            imageKind = 'Enemy'
        }
        if (imageKind == 'PlayerBullet' || imageKind == 'GeneralBullet' || imageKind == 'EnemyBullet' || imageKind == 'Bullet') {
            imageKind = 'Bullet'
        }
        log(image)
        this.elements[imageKind].push(image)
    }

    getImages(imageKind) {
        if (imageKind == 'GeneralEnemy' || imageKind == 'Boss' || imageKind == 'Enemy' || imageKind == 'Enemy1') {
            imageKind = 'Enemy'
        }
        if (imageKind == 'PlayerBullet' || imageKind == 'EnemyBullet' || imageKind == 'Bullet') {
            imageKind = 'Bullet'
        }
        return this.elements[imageKind]
    }

    removeImage(img) {
        var imageKind = img.constructor.name
        if (imageKind == 'GeneralEnemy' || imageKind == 'Boss' || imageKind == 'Enemy' || imageKind == 'Enemy1') {
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

class MainScene extends Scene{
    constructor(game) {
        super(game)

        this.bg1 = new Background(game, this, 'background')
        this.bg2 = new Background(game, this, 'background')
        this.bg1.y = 0
        this.bg2.y = -this.bg2.h
        this.player = new Player(game, this, 'player')
        this.enemeyTime = 100
        this.timer = 0
        this.hasBoss = false

        // var enemys = []
        // var y = 0
        // for (var i = 0; i < 10; i++) {
        //     var k = getRandomInt(0, 10)
        //     var isBuff = k == 9 ? true : false
        //     // var isBuff = true
        //     var e = new Enemy(game, this, 'enemy', isBuff)
        //     if (y == 30) {
        //         y = 0
        //     }
        //     e.y = y
        //     y -= 13
        //     enemys.push(e)
        // }

        this.addElement(this.bg1)
        this.addElement(this.bg2)
        this.addElement(this.player)

        // this.func(this)

        // for (var i = 0; i < enemys.length; i++) {
        //     this.addElement(enemys[i])
        // }

        // this.func(this)
        // var intervalId = setInterval(this.generateEnemy, 1000, this)
        // setInterval(clearInterval, 5000, intervalId)
        // this.generateBoss
        // setInterval(this.generateBoss, 100, this)

        this.init_listener()
    }

    update() {
        this.timer++
        // log('scene.timer', this.timer)
        for (var imageKind of Object.keys(this.elements)) {
            for (var img of this.elements[imageKind]) {
                img.update()
            }
        }

        // this.test('GeneralEnemy')

        // if (this.hasBoss == false) {
        //     this.generateBoss(this)
        //     this.hasBoss = true
        // }

        // if (this.timer <= 100) {
        //     if (this.timer % this.enemeyTime == 0) {
        //         this.generateEnemy(this)
        //     }
        // } else if (this.timer >= 500) {
        //     if (this.hasBoss == false) {
        //         this.generateBoss(this)
        //         this.hasBoss = true
        //     }
        // }
        //
        // if (this.timer <= 500 && this.timer % 200 == 0) {
        //     this.generateEnemy1(this)
        // }

    }

    test(className) {
        if (className == 'Enemy1'){
            if (this.timer >= 50) {
                if (this.hasBoss == false) {
                    this.generateEnemy1(this)
                    this.hasBoss = true
                }
            }
        }
        if (className == 'GeneralEnemy'){
            if (this.timer >= 50) {
                if (this.hasBoss == false) {
                    this.generateGeneralEnemy(this)
                    this.hasBoss = true
                }
            }
        }

    }

    generateGeneralEnemy(scene) {

        // log('enemy')
        var y = -15
        var k = getRandomInt(0, 10)
        var isBuff = k == 9 ? true : false
        // var isBuff = true
        var x1 = getRandomInt(5,135)
        // var x2 = getRandomInt(150,270)
        var e1 = new GeneralEnemy(scene.game, scene, 'enemy', x1, y, isBuff)
        // var e2 = new GeneralEnemy(scene.game, scene, 'enemy', x2, y - 15, isBuff)


        scene.addElement(e1)
        // scene.addElement(e2)
    }

    generateEnemy(scene) {

        // log('enemy')
        var y = -15
        var k = getRandomInt(0, 10)
        var isBuff = k == 9 ? true : false
        // var isBuff = true
        var x1 = getRandomInt(5,135)
        var x2 = getRandomInt(150,270)
        var e1 = new Enemy(scene.game, scene, 'enemy', x1, y, isBuff)
        var e2 = new Enemy(scene.game, scene, 'enemy', x2, y - 15, isBuff)

        scene.addElement(e1)
        scene.addElement(e2)
    }

    generateEnemy1(scene) {

        var y = -15
        var k = getRandomInt(0, 10)
        var isBuff = k == 9 ? true : false
        // var isBuff = true
        var x = getRandomInt(5,270)
        var e = new Enemy1(scene.game, scene, 'enemy1', x, y, isBuff)
        // log(e)

        scene.addElement(e)
    }

    generateBoss(scene) {
        // log('boss')
        scene.boss = new Boss(scene.game, scene, 'boss', 150, 1)
        // log(scene.boss)
        scene.addElement(scene.boss)
        // log(scene.elements)
    }

    getDistance(source, target) {
        var xDelta = (source.x - target.x)
        var yDelta = (source.y - target.y)
        var sum = Math.pow(xDelta, 2) + Math.pow(yDelta, 2)
        return Math.sqrt(sum)
    }


    init_listener() {
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

    displayCoordinate() {

    }
}
