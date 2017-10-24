

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
        this.timeToAttack = false
        this.timeToStop = false
        this.attackTime = 30

        this.timer = 0
        // this.stopTime = 20
    }

    update() {
        this.updateTimer()
        this.updateState()
    }

    goForward() {
        this.y += this.ySpeed
    }

    speed(source, target, speed) {
        var f = this.TrigonometricFunction(source, target)
        var xSpeed = speed * f.cos
        var ySpeed = speed * f.sin
        var o = {
            'x': xSpeed,
            'y': ySpeed,
        }
        return o
    }

    TrigonometricFunction(source, target) {
        var deltaX = target.x - source.x
        var deltaY = target.y - source.y
        var sum = Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
        var distance = Math.sqrt(sum)
        var o = {
            sin: deltaY / distance,
            cos: deltaX / distance,
        }
        return o
    }
}

class Subordinate extends Enemy {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.isBuff = this.isBuff()
        this.leaveTime = 200

    }

    isBuff() {
        var k = getRandomInt(0, 50)
        var isBuff = k == 9 ? true : false
        return isBuff
    }

    updateTimer() {
        this.timer++
        if (this.timer == this.stopTime) {
            this.timeToStop = true
        }
        if (this.timer == this.attackTime) {
            this.timeToAttack = true
        }
        if (this.timer == this.leaveTime) {
            this.timeToLeave = true
            this.timeToAttack = false
        }
    }

    updateState() {
        this.updatePosition()
        if (this.timeToAttack) {
            this.attack()
        }
        this.checkOutOfRange()
    }

    updatePosition() {
        if (!this.timeToStop) {
            this.goForward()
        } else if (this.timeToLeave) {
            this.goBack()
        }
    }

    goBack() {
        this.y -= this.ySpeed
    }

    checkOutOfRange() {
        if (this.y < -30) {
            this.disappear()
        }
    }

}


class Fighter extends Subordinate {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.stopTime = 30
        this.bulletSpeed = 5
        this.ySpeed = 1
        // debug
        this.leaveTime = 300
        this.attackTime = 50
    }

    attack() {
        this.bulletCooling--
        if (this.bulletCooling <= 0) {
            this.resetCooling()
            this.launch()
        }
    }


    launch() {
        var bulletDatas = this.bulletDatas()
        for (var b of bulletDatas) {
            var b = new EnemyBullet(this.game, this.scene, this.bulletImageName, b.x, b.y, b.xSpeed, b.ySpeed)
            this.scene.addElement(b)
        }
    }

    circleCenter() {
        var o = {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2,
        }
        return o
    }

    middleRadian() {
        if (this.isTrace) {
            var center = this.circleCenter()
            var target = {
                'x': this.target.x + this.w / 2,
                'y': this.target.y + this.h / 2,
            }
            return this.radian(center, target)
        } else {
            return Math.PI / 2
        }
    }

    radian(center, dot) {
        var deltaX = dot.x - center.x
        var deltaY = dot.y - center.y
        if (deltaY == 0) {
            var atan = 0
        } else {
            var tan = deltaY / deltaX
            var atan = Math.atan(tan)
        }
        if (deltaX < 0) {
            atan += Math.PI
        }
        return atan
    }

    bulletDatas() {
        var radius = 20
        var stepLength = 30 * Math.PI / 180
        var middle = this.middleRadian()
        var count = Math.floor(this.bulletCount / 2)
        var start = middle - count * stepLength
        // 计算有误差 所以加上步长的1/2，保证最后一个bullet能计入循环
        var end = middle + count * stepLength + stepLength / 2
        var center = this.circleCenter()
        var bulletDatas = []
        for (var radian = start; radian < end; radian += stepLength) {
            var b = this.bulletData(center, radian, radius)
            bulletDatas.push(b)
        }
        return bulletDatas
    }

    bulletData(center, radian, radius) {
        var x = center.x + radius * Math.cos(radian)
        var y = center.y + radius * Math.sin(radian)
        var bullet = {
            'x': x,
            'y': y,
        }
        var s = this.speed(center, bullet, this.bulletSpeed)
        bullet.xSpeed = s['x']
        bullet.ySpeed = s['y']
        return bullet
    }

    resetCooling() {
        this.bulletCooling = this.maxBulletCooling
    }

}

// 普通子弹 无发散 可追踪 子弹数1
class GeneralEnemy extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 20
        this.h = 20



        // bullet
        this.bulletCount = 1
        this.maxBulletCooling = 60
        this.bulletCooling = 0
        this.lives = 10
        this.bulletImageName = 'fireBullet'
        // this.attackTime = 30
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
// 发散 可追踪
class Enemy1 extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 20
        this.h = 20
        this.bulletImageName = 'fireBullet'

        this.bulletCount = 3
        this.xBulletSpeed = 0
        this.yBulletSpeed = 5
        this.maxBulletCooling = 60
        this.bulletCooling = this.maxBulletCooling


        // this.attackTime = 20

    }

    // launch() {
    //     var bulletDatas = this.bulletDatas()
    //     for (var b of bulletDatas) {
    //         var b = new EnemyBullet(this.game, this.scene, this.bulletImageName, b.x, b.y, b.xSpeed, b.ySpeed)
    //         this.scene.addElement(b)
    //     }
    // }

}

// 碰撞攻击 可追踪
class ForlornHope extends Subordinate {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 20
        this.h = 20
        this.ySpeed = 10
        this.stopTime = 12
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
        var speed = this.speed(this, this.target, this.attackSpeed)
        this.xSpeed = speed['x']
        this.ySpeed = speed['y']
    }

    move() {
        this.x += this.xSpeed
        this.y += this.ySpeed
    }

    checkOutOfRange() {
        if (this.y < -30 || this.y > this.scene.limitY) {
            this.disappear()
        }
    }

}

class Boss1 extends Enemy{
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 40
        this.h = 30
        this.ySpeed = 5

        this.bulletCount = 15
        this.maxBulletCooling = 80
        this.bulletCooling = 0
        this.lives = 100
        this.bulletImageName = 'fireBullet'
        this.stopTime = 50
        this.bulletSpeed = 1

        // 覆盖
        this.attackTime = 70
    }

    updateTimer() {
        this.timer++
        if (this.timer == this.stopTime) {
            this.timeToStop = true
        }
        if (this.timer == this.attackTime) {
            this.timeToAttack = true
        }
    }

    updateState() {
        this.updatePosition()
        if (this.timeToAttack) {
            this.attack()
        }
    }

    updatePosition() {
        if (!this.timeToStop) {
            this.goForward()
        }
    }

    attack() {
        this.bulletCooling--
        if (this.bulletCooling <= 0) {
            this.resetCooling()
            this.launch()
        }
    }


    launch() {
        var bulletDatas = this.bulletDatas()
        for (var b of bulletDatas) {
            var b = new EnemyBullet(this.game, this.scene, this.bulletImageName, b.x, b.y, b.xSpeed, b.ySpeed)
            this.scene.addElement(b)
        }
    }

    circleCenter() {
        var o = {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2,
        }
        return o
    }

    middleRadian() {
        if (this.isTrace) {
            var center = this.circleCenter()
            var target = {
                'x': this.target.x + this.w / 2,
                'y': this.target.y + this.h / 2,
            }
            return this.radian(center, target)
        } else {
            return Math.PI / 2
        }
    }

    radian(center, dot) {
        var deltaX = dot.x - center.x
        var deltaY = dot.y - center.y
        if (deltaY == 0) {
            var atan = 0
        } else {
            var tan = deltaY / deltaX
            var atan = Math.atan(tan)
        }
        if (deltaX < 0) {
            atan += Math.PI
        }
        return atan
    }

    bulletDatas() {
        var radius = 20
        var stepLength = 30 * Math.PI / 180
        var middle = this.middleRadian()
        var count = Math.floor(this.bulletCount / 2)
        var start = middle - count * stepLength
        // 计算有误差 所以加上步长的1/2，保证最后一个bullet能计入循环
        var end = middle + count * stepLength + stepLength / 2
        var center = this.circleCenter()
        var bulletDatas = []
        for (var radian = start; radian < end; radian += stepLength) {
            var b = this.bulletData(center, radian, radius)
            bulletDatas.push(b)
        }
        return bulletDatas
    }

    bulletData(center, radian, radius) {
        var x = center.x + radius * Math.cos(radian)
        var y = center.y + radius * Math.sin(radian)
        var bullet = {
            'x': x,
            'y': y,
        }
        var s = this.speed(center, bullet, this.bulletSpeed)
        bullet.xSpeed = s['x']
        bullet.ySpeed = s['y']
        return bullet
    }

    resetCooling() {
        this.bulletCooling = this.maxBulletCooling
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
