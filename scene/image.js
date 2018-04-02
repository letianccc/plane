
// log('image')
rate = 10
maxBuffTime = 400

class MyImage {
    constructor(game, scene, imgName) {
        this.game = game
        this.scene = scene
        this.img = game.imageByName(imgName)
    }

    update() {}
    draw() {}

    disappear() {
        this.scene.removeImage(this)
    }
}

class Plane extends MyImage {
    constructor(game, scene, imgName, x, y) {
        super(game, scene, imgName)
        this.x = x
        this.y = y
    }
}




// spark 图形需要改变
class Spark extends MyImage{
    constructor(game, scene, x, y) {
        super(game, scene, 'fireBullet')
        this.x = x
        this.y = y
        this.w = 10
        this.h = 10
        this.xDirection = getRandomInt(0, 1) == 0 ? -1 : 1
        this.yDirection = getRandomInt(0, 1) == 0 ? -1 : 1
        this.xSpeed = this.xDirection * getRandom(0, 1)
        this.ySpeed = this.yDirection * getRandom(0, 1)

        this.alive = 10
    }

    update() {
        this.alive--
        this.x += this.xSpeed
        this.y += this.ySpeed
        if (this.alive == 0) {
            this.scene.removeImage(this)
        }
    }
}

class Buff extends MyImage{
    constructor(game, scene, imgName, x, y) {
        super(game, scene, imgName)
        this.scene = scene
        this.game = game
        this.w = 10
        this.h = 10
        this.x = x
        // this.y = -this.h
        this.y = y
        this.speed = 1 * this.rate
    }

    update() {
        this.move()
        // this.updateAlive()
    }

    move() {
        this.y += this.speed

        if (this.y >= 150) {
            this.scene.removeImage(this)
        }
    }
}
