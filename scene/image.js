class MyImage {
    constructor(game, imgName) {
        this.rate = 1
        this.img = game.imageByName(imgName)
        this.x = 0
        this.y = 0
        this.w = this.img.width
        this.h = this.img.height
        this.alive = true
    }

    update() {}
    draw() {}
}

class Player extends MyImage{
    constructor(game, imgName) {
        super(game, imgName)
        this.game = game
        this.x = 120
        this.y = 130
        this.w = 20
        this.h = 20
        this.speed = 5 * this.rate
    }

    launch() {
        var b = new Bullet(this.game, 'bullet')
        b.y = this.y
        b.x = this.x + 8
        this.game.scene.addElement(b)
    }

    moveLeft() {
        this.x -= this.speed
    }
    moveRight() {
        this.x += this.speed
    }
    moveUp() {
        this.y -= this.speed
    }
    moveDown() {
        this.y += this.speed
    }
}

class Bullet extends MyImage{
    constructor(game, imgName) {
        super(game, imgName)
        this.x = 20
        this.y = 120
        this.w = 3
        this.h = 3
        this.speed = 5 * this.rate
    }

    update() {
        this.y -= this.speed
    }
}

class Background extends MyImage{
    constructor(game, imgName) {
        super(game, imgName)
        this.game = game
        this.x = 0
        // this.y = 0
        this.w = 400
        this.h = 300
        this.speed = 5 * this.rate
    }

    update() {
        this.y += this.speed
        if (this.y >= this.h) {
            this.y = -this.h
        }
    }
}

class Enemy extends MyImage{
    constructor(game, imgName) {
        super(game, imgName)
        this.scene = game.scene
        log(game)
        log(game.scene)
        this.x = 0
        this.y = 0
        this.w = 40
        this.h = 30
        this.speed = 2 * this.rate
    }

    update() {
        this.move()
        // this.updateAlive()
    }

    move() {
        this.y += this.speed
    }

    updateAlive() {
        log(this.scene)
        var bullets = this.scene.bullets()
        for (var b in bullets) {
            if (isCollide(b)) {
                this.alive = false
            }
        }
    }

    isCollide(bullet) {
        if (this.x <= bullet.x <= this.x + this.w)
            if (this.y <= bullet.y <= this.y + this.height)
                return true
        return false
    }

}




