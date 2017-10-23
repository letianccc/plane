

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

class Player extends Plane {
    constructor(game, scene, imgName, x, y) {
        super(game, scene, imgName, x, y)
        this.w = 20
        this.h = 20
        this.speed = 15
        this.buffAmount = 0
        this.maxBulletCooling = 2
        this.bulletCooling = 0
        this.lives = 1000
    }

    attack() {
        this.bulletCooling--
        if (this.isTimeToLaunch()) {
            this.launch()
            this.bulletCooling = this.maxBulletCooling
        }
    }

    isTimeToLaunch() {
        return this.bulletCooling <= 0
    }

    launch() {
        log('launch')
    }

    // launch() {
    //     // log('f')
    //     var xIncrement = 0
    //     var yIncrement = -5
    //     var xSpeed = 0
    //     var ySpeed = -20
    //     var x = this.x + this.w / 2
    //     var y = this.y
    //
    //     var b = new PlayerBullet(this.game, this.scene, x, y, xSpeed, ySpeed)
    //     this.scene.addElement(b)
    //     // log(b)
    //
    //     if (this.buffAmount > 0) {
    //         for (var i = 1; i <= this.buffAmount; i++) {
    //             if (i <= 2) {
    //                 xIncrement += 10
    //                 var x1 = x + xIncrement
    //                 var x2 = x - xIncrement
    //             } else {
    //                 yIncrement += 10
    //                 y += yIncrement
    //                 xSpeed = 10
    //             }
    //             var b1 = new PlayerBullet(this.game, this.scene, x1, y, xSpeed, ySpeed)
    //             var b2 = new PlayerBullet(this.game, this.scene, x2, y, -xSpeed, ySpeed)
    //             // var b1 = new Bullet(this.game, this.scene, 'playerBullet', x1, y, xSpeed, ySpeed, this.target)
    //             // var b2 = new Bullet(this.game, this.scene, 'playerBullet', x2, y, -xSpeed, ySpeed, this.target)
    //             this.scene.addElement(b1)
    //             this.scene.addElement(b2)
    //         }
    //     }
    // }


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
                buff.disappear()
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

class Enemy extends Plane {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y)
        // this.w = width
        // this.h = height
        // this.isBuff = isBuff
        // this.lives = lives
        // this.timer = 10
        this.target = this.scene.player
        this.isTrace = isTrace
        this.isBuff = this.isBuff()
        this.timeToAttack = false
        this.timeToStop = false
        this.leaveTime = 200
        this.attackTime = 50

        this.timer = 0
        // this.stopTime = 20
    }

    isBuff() {
        var k = getRandomInt(0, 50)
        var isBuff = k == 9 ? true : false
        return isBuff
    }

    update() {
        this.updateTimer()
        this.updateState()
        this.updatePosition()
        if (this.timeToAttack) {
            // log(this)
            this.attack()
        }
        this.checkOutOfRange()
    }


    updateTimer() {
        this.timer++
    }

    updateState() {
        if (this.timer == this.stopTime) {
            this.timeToStop = true
        }
        if (this.timer == this.attackTime) {
            this.timeToAttack = true
        }
        if (this.timer == this.leaveTime) {
            this.timeToLeave = true
        }
    }

    updatePosition() {
        if (!this.timeToStop) {
            this.goForward()
        } else if (this.timeToLeave) {
            this.goBack()
        }
    }

    goForward() {
        this.y += this.ySpeed
    }

    goBack() {
        this.y -= this.ySpeed
    }

    checkOutOfRange() {
        if (this.y < -30) {
            this.disappear()
        }
    }

    speed(speed) {
        var f = this.TrigonometricFunction(this.target, this)
        var xSpeed = speed * f.cos
        var ySpeed = speed * f.sin
        var o = {
            'xSpeed': xSpeed,
            'ySpeed': ySpeed
        }
        return o
    }

    TrigonometricFunction(source, target) {
        var deltaX = source.x - target.x
        var deltaY = source.y - target.y
        var sum = Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
        var distance = Math.sqrt(sum)
        var o = {
            sin: deltaY / distance,
            cos: deltaX / distance,
        }
        return o
    }
}

class Fighter extends Enemy {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.stopTime = 15
        this.bulletSpeed = 1

    }

    attack() {
        this.bulletCooling--
        if (this.bulletCooling == 0) {
            this.resetCooling()
            this.launch()
        }
    }

    circleCenter() {
        var o = {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2,
        }
        return o
    }

    launch() {
        // this.setSpeed()
        var r = 10
        var center = this.circleCenter()
        // log(center)
        var stepLength = 30 * Math.PI / 180
        var middle = Math.PI / 2
        // var radian = middle
        var start = middle - 2 * stepLength
        var end = middle + 2 * stepLength
        for (var radian = start; radian <= end; radian += stepLength) {
            var x = center.x + r * Math.cos(radian)
            var y = center.y + r * Math.sin(radian)
            // log(x, y)
            var b = new EnemyBullet(this.game, this.scene, this.bullet, x, y, 0, this.bulletSpeed)
            this.scene.addElement(b)
            log(this.bulletSpeed)
            log(b)
        }
    }

    setSpeed() {
        // var
        var r = 10
        var center = this.circleCenter()
        var stepLength = 30 * Math.PI / 180
        var middle = 0
        var radian = middle
        var start = middle - 2 * stepLength
        var end = middle + 2 * stepLength
        for (var radian = start; radian <= end; radian += stepLength) {
            x = center.x + r * Math.cos(radian)
            y = center.y + r * Math.sin(radian)
            var b = new GeneralBullet(this.game, this.scene, x, y, 0, this.bulletSpeed)
            this.scene.addElement(b)
        }

    }

    launch1() {
        // var xSpeed = 0
        // var ySpeed = 5
        var x = this.x
        // var y = this.y
        var y = this.y + this.h

        var b = new GeneralBullet(this.game, this.scene, x, y, this.bulletSpeed)
        this.scene.addElement(b)
        // log(this)
        // log('enemy', this.y, this.h)
        // log('bullet', b.y)
        // var b = new EnemyBullet(this.game, this.scene, this.bullet, x, y - 5, xSpeed, ySpeed, this.target)
        // this.scene.addElement(b)
    }

    resetCooling() {
        this.bulletCooling = this.maxBulletCooling
    }

}

// 普通子弹 无发散 无追踪 子弹对数1
class GeneralEnemy extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 20
        this.h = 20
        this.speed = 2

        // bullet
        this.bulletCount = 2
        this.bulletSpeed = 1
        this.maxBulletCooling = 60
        this.bulletCooling = 0
        this.lives = 10
        this.bullet = 'enemyBullet'
        this.attackTime = 30
    }

    // launch() {
    //     this.bulletCooling--
    //     if (this.bulletCooling <= 0) {
    //         this.bulletCooling = this.maxBulletCooling
    //
    //         // var xSpeed = 0
    //         // var ySpeed = 5
    //         var x = this.x
    //         // var y = this.y
    //         var y = this.y + this.h
    //
    //         var b = new GeneralBullet(this.game, this.scene, x, y, this.bulletSpeed)
    //         this.scene.addElement(b)
    //         // log(this)
    //         // log('enemy', this.y, this.h)
    //         // log('bullet', b.y)
    //         // var b = new EnemyBullet(this.game, this.scene, this.bullet, x, y - 5, xSpeed, ySpeed, this.target)
    //         // this.scene.addElement(b)
    //     }
    // }

}
// 发散 可追踪 子弹对数不定
class Enemy1 extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 20
        this.h = 20
        this.bullet = 'fireBullet'

        this.bulletCount = 2
        this.xBulletSpeed = 0
        this.yBulletSpeed = 5
        this.maxBulletCooling = 60
        this.bulletCooling = this.maxBulletCooling

        this.ySpeed = 5

        this.attackTime = 20

    }

    // launch() {
    //     this.bulletCooling--
    //     if (this.bulletCooling <= 0) {
    //         this.bulletCooling = this.maxBulletCooling
    //
    //         var x = this.x + this.w / 2
    //         var y = this.y + this.h
    //         // var xSpeed = 0
    //         // var ySpeed = 5
    //         var xIncrement = 0
    //
    //         if (this.isTrace == true) {
    //             // log('true')
    //             var speed = this.speed(this.speed)
    //             this.xBulletSpeed = speed['xSpeed']
    //             this.yBulletSpeed = speed['ySpeed']
    //         }
    //
    //         for (var i = 0; i < this.bulletCount; i++) {
    //             if (this.isTrace == false) {
    //                 // log('false')
    //                 this.xBulletSpeed += 1
    //             }
    //
    //             xIncrement += 20
    //             var x1 = x - xIncrement
    //             var x2 = x + xIncrement
    //             var b1 = new EnemyBullet(this.game, this.scene, this.bullet, x1, y, -this.xBulletSpeed, this.yBulletSpeed, this.target)
    //             var b2 = new EnemyBullet(this.game, this.scene, this.bullet, x2, y, this.xBulletSpeed, this.yBulletSpeed, this.target)
    //             this.scene.addElement(b1)
    //             this.scene.addElement(b2)
    //         }
    //     }
    // }

}

// 碰撞攻击 可追踪
class ForlornHope extends Enemy {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 20
        this.h = 20
        this.ySpeed = 10
        this.stopTime = 10
        this.attackSpeed = 20
        this.leaveTime = this.getLeaveTime()
    }

    getLeaveTime() {
        return this.isTrace ? 1000 : 100
    }
    // 追踪算法有错误
    attack() {
        if (this.isTrace) {
            if (this.timer == this.attackTime) {
                this.setAttackState()
            }
            this.rapidCollide()
        }
    }

    rapidCollide() {
        this.move()
    }

    setAttackState() {
        var speed = this.speed(this.attackSpeed)
        this.xSpeed = speed['xSpeed']
        this.ySpeed = speed['ySpeed']
    }

    move() {
        this.x += this.xSpeed
        this.y += this.ySpeed
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


class Bullet extends MyImage {
    constructor(game, scene, imgName, xSpeed, ySpeed) {
        super(game, scene, imgName)
        // this.x = launcherX
        // this.y = launcherY
        // log('launch', this.y)
        // this.x = launcherX - this.w / 2
        // this.y = launcherY
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed

        // this.xSpeed = xSpeed
        // this.ySpeed = ySpeed
        // this.w = 20
        // this.h = 10
        // log('t', target)
        // this.target = target
        // this.speed = 5 * this.rate
        // if (this.trace == true) {
        //
        // }
    }

    update() {
        this.updatePosition()
        // this.checkShot()
        this.checkOutOfRange()
    }

    updatePosition() {
        this.move()
    }

    checkShot() {
        // log(this)
        // log(this.target)
        var targets = this.scene.getImages(this.target)
        for (var target of targets) {
            if (isCollide(this, target)) {
                target.lives--
                this.makeSpark(target)
                this.disappear()
                this.checkTargetAlive(target)
            }
        }
    }

    makeSpark(image) {
        for( var i = 0; i < 100; i++) {
            sparkX = image.x + image.w / 2
            sparkY = image.y + image.h / 2
            var spark = new Spark(this.game, this.scene, sparkX, sparkY)
            this.scene.addElement(spark)
        }
    }

}

class PlayerBullet extends Bullet {
    constructor(game, scene, launcherX, launcherY, xSpeed, ySpeed) {
        super(game, scene, 'fireBullet', launcherX, launcherY, xSpeed, ySpeed)
        this.target = 'Enemy'
        this.timer = 10
        this.w = 5
        this.h = 5
        this.x = launcherX - this.w / 2
        this.y = launcherY
    }

    checkTargetAlive(target) {
        if (target.lives == 0) {
            target.disappear()
        }
    }

    checkOutOfRange() {
        if (this.y < 0) {
            this.disappear()
        }
    }

    updatePosition() {
        this.move()
    }

    move() {
        this.x += this.xSpeed
        this.y += this.ySpeed
    }
}

class EnemyBullet extends Bullet {
    constructor(game, scene, imgName, x, y, xSpeed, ySpeed) {
        super(game, scene, imgName, xSpeed, ySpeed)
        this.target = 'Player'
        this.w = 5
        this.h = 5
        this.x = x - this.w / 2
        this.y = y - this.h / 2
        // this.speed = 3
        // this.w = 30
        // this.h = 15
        // this.x = x - this.w / 2
        // this.y = y
        // this.xSpeed = xSpeed
        // this.ySpeed = ySpeed
        this.timer = 10
    }

    move() {
        this.x += this.xSpeed
        this.y += this.ySpeed
    }

    // update() {
    //
    //
    //     // log(this.y)
    //     // if (this.timer > 0) {
    //     //     this.timer--
    //     // }
    //     // if (this.timer == 0) {
    //     //     this.x += this.xSpeed
    //     //     this.y += this.ySpeed
    //     // }
    //     //
    //     // if (this.y == 0) {
    //     //     this.scene.removeImage(this)
    //     // }
    //     //
    //     // this.checkShot()
    //     //
    //     // if (this.y >= 700 || this.y <= -10) {
    //     //     this.disappear()
    //     // }
    // }

    // checkShot() {
    //     // log(this)
    //     // log(this.target)
    //     // var targets = this.scene.getImages(this.target)
    //     var target = this.target
    //
    //     if (isCollide(this, target)) {
    //         target.lives--
    //         this.makeSpark(target)
    //         this.disappear()
    //         this.checkTargetAlive()
    //     }
    // }

    checkTargetAlive(target) {
        if (target.lives == 0) {
            target.disappear()
        }
    }

    checkOutOfRange() {
        if (this.y >= this.scene.limitY) {
            this.disappear()
        }
    }
}

// 无发散 无追踪
class GeneralBullet extends EnemyBullet {
    constructor(game, scene, x, y, speed) {
        super(game, scene, 'enemyBullet', x, y, 0, speed)
        // this.target = this.scene.player
        this.w = 30
        this.h = 15
        // this.x = x - this.w / 2
        // this.y = y
        // this.speed = speed
        // this.timer = 10
    }

    updatePosition() {
        this.move()
    }

    // update() {
    //     // if (this.timer > 0) {
    //     //     this.timer--
    //     // }
    //
    //     // if (this.timer == 0) {
    //     //     this.y += this.speed
    //     // }
    //     // this.y += this.speed
    //
    //     // if (this.y == 0) {
    //     //     this.scene.removeImage(this)
    //     // }
    //
    //     // this.checkShot()
    //     //
    //     // if (this.y >= 700 || this.y <= -10) {
    //     //     this.disappear()
    //     // }
    // }

    // checkShot() {
    //     // log(this)
    //     // log(this.target)
    //     // var targets = this.scene.getImages(this.target)
    //     var t = this.target
    //
    //     if (isCollide(this, t)) {
    //         t.alive--
    //
    //         for( var i = 0; i < 100; i++) {
    //             var spark = new Spark(this.game, this.scene, 'spark', t.x + t.w / 2, t.y + t.h / 2)
    //             this.scene.addElement(spark)
    //         }
    //
    //         if (t.alive == 0) {
    //             // for( var i = 0; i < 100; i++) {
    //             //     var spark = new Spark(this.game, this.scene, 'spark', t.x, t.y)
    //             //     this.scene.addElement('spark', spark)
    //             // }
    //
    //             if (t.constructor.name == 'Enemy' && t.isBuff) {
    //                 // log('s')
    //                 var b = new Buff(this.game, this.scene, 'buff', this.x, this.y)
    //                 this.scene.addElement(b)
    //             }
    //
    //             // 删除元素
    //             this.scene.removeImage('Player')
    //
    //             this.scene.removeImage(this)
    //         }
    //
    //
    //
    //     }
    // }

    // disappear() {
    //     this.scene.removeImage(this)
    // }
}

class Background extends MyImage {
    constructor(game, scene, imgName) {
        super(game, scene, imgName)
        this.x = 0
        this.y = 0
        this.w = 400
        this.h = 300
    }

    update() {}
}

class StartBackground extends Background {
    constructor(game, scene, imgName) {
        super(game, scene, imgName)
    }
}

class MainBackground extends Background {
    constructor(game, scene, imgName) {
        super(game, scene, imgName)
        this.speed = 5
    }

    update() {
        // log('bg')
        this.y += this.speed
        if (this.y >= this.h) {
            this.y = -this.h
        }
    }
}

class Spark extends MyImage{
    constructor(game, scene, x, y) {
        super(game, scene, 'spark')
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
