
maxBuffTime = 400

class MyImage {
    constructor(game, scene, imgName) {
        this.game = game
        this.scene = scene
        this.rate = 1
        // log(imgName)
        this.img = game.imageByName(imgName)
        this.x = 0
        this.y = 0
        // log(this.img)
        this.w = this.img.width
        this.h = this.img.height
        // this.w = width
        // this.h = height
        // log(height)
        this.alive = true
    }

    update() {}
    draw() {}

    remove() {
        this.scene.removeImage(this)
    }
}

class Player extends MyImage{
    constructor(game, scene, imgName, speed) {
        super(game, scene, imgName)
        this.game = game
        this.scene = scene
        this.x = 120
        this.y = 130
        this.w = 20
        this.h = 20
        this.speed = speed * this.rate
        this.buffAmount = 0
        this.loadBullet = 0
        this.alive = 1000
        this.target = 'Enemy'
    }

    launch() {
        this.loadBullet++
        if (this.loadBullet >= 2 ) {
            this.loadBullet = 0

            var xIncrement = 0
            var yIncrement = -5
            var xSpeed = 0
            var ySpeed = -10
            var x = this.x
            var y = this.y

            var b = new Bullet(this.game, this.scene, 'playerBullet', x, y, xSpeed, ySpeed, this.target)
            this.scene.addElement(b)

            if (this.buffAmount > 0) {
                for (var i = 1; i <= this.buffAmount; i++) {
                    if (i <= 2) {
                        xIncrement += 5
                        var x1 = x + xIncrement
                        var x2 = x - xIncrement
                    } else {
                        yIncrement += 10
                        y = y - yIncrement
                        xSpeed = 4
                    }
                    var b1 = new Bullet(this.game, this.scene, 'playerBullet', x1, y, xSpeed, ySpeed, this.target)
                    var b2 = new Bullet(this.game, this.scene, 'playerBullet', x2, y, -xSpeed, ySpeed, this.target)
                    this.scene.addElement(b1)
                    this.scene.addElement(b2)
                }
            }
        }


    }

    update() {
        // log(this.y)
        // log(this.x)
        this.updateState()
    }

    updateState() {
        for (var buff of this.scene.getImages('Buff')) {
            if (isCollide(this, buff)) {
                if (this.buffAmount < 4) {
                    this.buffAmount++
                }
                this.scene.removeImage(buff)
            }
        }
    }

    moveLeft() {
        if (this.x > 0) {

            this.x -= this.speed
        }
    }
    moveRight() {
        if (this.x < 280) {

            this.x += this.speed
        }
    }
    moveUp() {
        if (this.y > 2) {
            this.y -= this.speed
        }
    }
    moveDown() {
        if (this.y < 130) {
            this.y += this.speed
        }
    }
}

class Bullet extends MyImage{
    constructor(game, scene, imgName, x, y, xSpeed, ySpeed, target) {
        super(game, scene, imgName)
        this.x = x
        this.y = y
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed
        this.w = 20
        this.h = 10
        // log('t', target)
        this.target = target
        // this.speed = 5 * this.rate
        // if (this.trace == true) {
        //
        // }
    }

    // trace() {
    //     var distance = this.scene.getDistance(this.target, this)
    //
    //     var xDelta = this.target.x - this.x
    //     var yDelta = this.target.y - this.y
    //     var sin = yDelta / distance
    //     var cos = xDelta / distance
    //     this.ySpeed = this.speed * sin
    //     this.xSpeed = this.speed * cos
    // }

    update() {
        this.x += this.xSpeed
        this.y += this.ySpeed




        if (this.y == 0) {
            this.scene.removeImage(this)
        }

        this.checkShot()

        if (this.y >= 700 || this.y <= -10) {
            this.remove()
        }
    }

    checkShot() {
        // log(this)
        // log(this.target)
        var targets = this.scene.getImages(this.target)


        for (var t of targets) {
            if (isCollide(this, t)) {
                t.alive--

                for( var i = 0; i < 100; i++) {
                    var spark = new Spark(this.game, this.scene, 'spark', t.x + t.w / 2, t.y + t.h / 2)
                    this.scene.addElement(spark)
                }

                if (t.alive == 0) {
                    // for( var i = 0; i < 100; i++) {
                    //     var spark = new Spark(this.game, this.scene, 'spark', t.x, t.y)
                    //     this.scene.addElement('spark', spark)
                    // }

                    if (t.constructor.name == 'Enemy' && t.isBuff) {
                        // log('s')
                        var b = new Buff(this.game, this.scene, 'buff', this.x, this.y)
                        this.scene.addElement(b)
                    }

                    // 删除元素
                    this.scene.removeImage(t)

                    this.scene.removeImage(this)
                }



            }
        }
    }

    remove() {
        this.scene.removeImage(this)
    }

}

class EnemyBullet extends Bullet{
    constructor(game, scene, imgName, x, y, xSpeed, ySpeed, target) {
        super(game, scene, imgName, x, y, xSpeed, ySpeed, target)
        this.target = this.scene.player
        this.speed = 3
        this.w = 30
        this.h = 15
        this.x = x - this.w / 2
        this.y = y
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed
        this.timer = 10


        // var distance = this.scene.getDistance(this.target, this)
        //
        // var xDelta = this.target.x - this.x
        // var yDelta = this.target.y - this.y
        // var sin = yDelta / distance
        // var cos = xDelta / distance
        // this.ySpeed = this.speed * sin
        // this.xSpeed = this.speed * cos
        // log(this.x, this.y)


        // this.ySpeed = yDifference > 0 ? speed : -speed
        // if (yDifference != 0) {
        //     this.angle = xDifference / yDifference
        //     this.speed = speed
        //     this.xSpeed = this.ySpeed * this.angle
        // } else {
        //     this.xSpeed = speed
        // }
        // log(this)
        // log('angle', this.angle)
        // log('x', this.xSpeed)
        // log('y', this.ySpeed)
        // log()

        // log('t', target)
        // this.speed = 5 * this.rate
    }

    update() {
        log(this.y)
        if (this.timer > 0) {
            this.timer--
        }
        if (this.timer == 0) {
            this.x += this.xSpeed
            this.y += this.ySpeed
        }

        if (this.y == 0) {
            this.scene.removeImage(this)
        }

        this.checkShot()

        if (this.y >= 700 || this.y <= -10) {
            this.remove()
        }
    }

    checkShot() {
        // log(this)
        // log(this.target)
        // var targets = this.scene.getImages(this.target)
        var t = this.target

        if (isCollide(this, t)) {
            t.alive--

            for( var i = 0; i < 100; i++) {
                var spark = new Spark(this.game, this.scene, 'spark', t.x + t.w / 2, t.y + t.h / 2)
                this.scene.addElement(spark)
            }

            if (t.alive == 0) {
                // for( var i = 0; i < 100; i++) {
                //     var spark = new Spark(this.game, this.scene, 'spark', t.x, t.y)
                //     this.scene.addElement('spark', spark)
                // }

                if (t.constructor.name == 'Enemy' && t.isBuff) {
                    // log('s')
                    var b = new Buff(this.game, this.scene, 'buff', this.x, this.y)
                    this.scene.addElement(b)
                }

                // 删除元素
                this.scene.removeImage('Player')

                this.scene.removeImage(this)
            }



        }
    }

    remove() {
        this.scene.removeImage(this)
    }
}



class Background extends MyImage{
    constructor(game, scene, imgName) {
        super(game, scene, imgName)
        this.x = 0
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
    constructor(game, scene, imgName, x, y) {
        // log(isBuff)
        super(game, scene, imgName)
        // this.w = width
        // this.h = height
        this.x = x
        this.y = y
        // this.speed = 1
        // this.isBuff = isBuff
        // this.bulletCooling = bulletCooling
        // this.lives = lives
        // this.timer = 10
        this.target = 'Player'
        // this.bulletKind = bulletKind
    }

    // constructor(game, scene, imgName, x, y, width, height, bulletKind, bulletCooling, lives, isBuff=false) {
    //     // log(isBuff)
    //     super(game, scene, imgName)
    //     this.w = width
    //     this.h = height
    //     this.x = x
    //     this.y = y
    //     this.speed = 1
    //     this.isBuff = isBuff
    //     this.bulletCooling = bulletCooling
    //     this.lives = lives
    //     // this.timer = 10
    //     this.target = 'Player'
    //     this.bulletKind = bulletKind
    // }


    move() {
        this.y += this.speed
    }

    checkOutOfRange() {
        if (this.y >= this.scene.limitY) {
            this.remove()
        }
    }
}



// 普通子弹 无发散 无追踪 子弹对数1
class GeneralEnemy extends Enemy{
    constructor(game, scene, imgName, x, y, isBuff=false) {
        super(game, scene, imgName, x, y)
        this.w = 40
        this.h = 40
        this.speed = 1
        this.maxBulletCooling = 60
        this.bulletCooling = 0
        this.lives = 10
        this.bullet = 'enemyBullet'
        this.isBuff = isBuff
        // log('enemy', this.y, this.h)
    }

    update() {

        if (this.y <= 0)
        this.move()

        if (this.y >= 0) {
            this.launch()
        }

        this.checkOutOfRange()

        // if (this.y >= this.scene.limitY) {
        //     this.remove()
        // }
    }

    launch() {

        this.bulletCooling--
        if (this.bulletCooling <= 0) {
            this.bulletCooling = this.maxBulletCooling

            var xSpeed = 0
            var ySpeed = 5
            var x = this.x + this.w / 2
            var y = this.y + this.h

            var b = new EnemyBullet(this.game, this.scene, this.bullet, x, y, xSpeed, ySpeed, this.target)
            this.scene.addElement(b)
            // log(this)
            // log('enemy', this.y, this.h)
            // log('bullet', b.y)
            // var b = new EnemyBullet(this.game, this.scene, this.bullet, x, y - 5, xSpeed, ySpeed, this.target)
            // this.scene.addElement(b)
        }
    }

    // move() {
    //     this.y += this.speed
    // }
}

class Enemy1 extends Enemy {
    constructor(game, scene, imgName, x, y, isBuff=false, isTrace=false) {
        super(game, scene, imgName, x, y, isBuff)
        this.bullet = 'fireBullet'
        this.timer = 0
        this.isTrace = isTrace
        this.bulletCount = 2
    }

    launch() {
        this.loadBullet++
        if (this.loadBullet >= 60) {
            this.loadBullet = 0

            var xSpeed = 0
            var ySpeed = 5
            var x = this.x + this.w / 2
            var y = this.y + this.h
            // var xSpeed = 0
            // var ySpeed = 5
            var xIncrement = 0

            if (this.isTrace == true) {
                // log('true')
                var speed = this.speed()
                xSpeed = speed['xSpeed']
                ySpeed = speed['ySpeed']
            }

            for (var i = 0; i < this.bulletCount; i++) {
                if (this.isTrace == false) {
                    // log('false')
                    xSpeed += 1
                }

                xIncrement += 20
                var x1 = x - xIncrement
                var x2 = x + xIncrement
                var b1 = new EnemyBullet(this.game, this.scene, this.bullet, x1, y, -xSpeed, ySpeed, this.target)
                var b2 = new EnemyBullet(this.game, this.scene, this.bullet, x2, y, xSpeed, ySpeed, this.target)
                this.scene.addElement(b1)
                this.scene.addElement(b2)
            }

            // var xSpeed = -10
            // var ySpeed = 5
            // var x = this.x + 20
            // var y = this.y + this.h
            //
            // for (var i = 0; i < 4; i++) {
            //     xSpeed += 5
            //     var b = new EnemyBullet(this.game, this.scene, this.bullet, x, y, xSpeed, ySpeed, this.target)
            //     this.scene.addElement(b)
            // }
        }
    }

    speed(totalSpeed) {
        var distance = this.scene.getDistance(this.target, this)

        var xDelta = this.target.x - this.x
        var yDelta = this.target.y - this.y
        var sin = yDelta / distance
        var cos = xDelta / distance
        var ySpeed = totalSpeed * sin
        var xSpeed = totalSpeed * cos
        var o = {
            'xSpeed': xSpeed,
            'ySpeed': ySpeed
        }
        return o
    }

    update() {
        // log(this.y)
        this.timer++

        if (this.timer <= 20) {
            this.move()
        } else {
            this.launch()
        }


        // if (this.timer <= 20 || this.timer >= 100) {
        //     this.move()
        //     if (this.y >= 700) {
        //         this.remove()
        //     }
        // } else {
        //     this.launch()
        // }

    }
}

class Boss extends MyImage{
    constructor(game, scene, imgName, x, y) {
        // log(y)
        // log(isBuff)
        super(game, scene, imgName)
        this.scene = scene
        this.game = game
        this.w = 40
        this.h = 30
        this.x = this.scene.limitX / 2
        this.y = y
        // log(this.y)
        this.speed = 1 * this.rate
        this.loadBullet = 60
        this.alive = 10
        this.target = 'Player'
        this.bullet = 'fireBullet'
    }

    update() {
        // log(this.y)
        if (this.y <= 30) {
            this.move()
        }
        if (this.y >= 30) {
            log(this.x, this.y)
            this.launch()
        }
    }

    launch() {
        this.loadBullet++
        if (this.loadBullet >= 60) {
            this.loadBullet = 0

            var xSpeed = -10
            var ySpeed = 5
            var x = this.x + this.w / 2
            var y = this.y + this.h
            var xIncrement = 0

            for (var i = 0; i < 1; i++) {
                xIncrement += 20
                var x1 = x - xIncrement
                var x2 = x + xIncrement
                var b1 = new EnemyBullet(this.game, this.scene, this.bullet, x1, y, xSpeed, ySpeed, this.target)
                var b2 = new EnemyBullet(this.game, this.scene, this.bullet, x2, y, xSpeed, ySpeed, this.target)
                this.scene.addElement(b1)
                this.scene.addElement(b2)
            }
        }
    }

    move() {
        this.y += this.speed
    }
}

class Spark extends MyImage{
    constructor(game, scene, imgName, x, y) {
        super(game, scene, imgName)
        this.game = game
        this.scene = scene
        this.x = x
        this.y = y
        this.xDirection = getRandomInt(0, 1) == 0 ? -1 : 1
        this.yDirection = getRandomInt(0, 1) == 0 ? -1 : 1
        this.xSpeed = this.xDirection * getRandom(0, 1)
        this.ySpeed = this.yDirection * getRandom(0, 1)
        this.w = 2
        this.h = 2
        this.alive = 4
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
