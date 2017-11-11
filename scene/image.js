


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
    constructor(game, scene, imgName) {
        super(game, scene, 'player', 225, 450)
        this.w = 50
        this.h = 50
        this.speed = 25
        this.buffAmount = 0

        this.bulletSpeed = 40
        this.bulletCooling = 2
        this.bulletImageName = 'fireBullet'

        this.lives = 1000
        this.isTrace = false
        this.bulletCount = 1
        this.timer = 0
    }

    attack() {
        if (this.timer % this.bulletCooling == 0) {
            this.launch()
        }
    }

    launch() {
        // log('launch')
        var bulletDatas = this.bulletDatas()
        for (var b of bulletDatas) {
            var b = new PlayerBullet(this.game, this.scene, this.bulletImageName, b.x, b.y, b.xSpeed, b.ySpeed)
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
            return -Math.PI / 2
        }
    }

    bulletDatas() {
        var radius = 5
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
        var s = this.getSpeed(center, bullet, this.bulletSpeed)
        bullet.xSpeed = s['x']
        bullet.ySpeed = s['y']
        return bullet
    }

    getSpeed(source, target, speed) {
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

    update() {
        // log(this.x, this.y)
        this.updateTimer()
        // this.updateState()
    }

    updateTimer() {
        this.timer++
    }
    // buff
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
        if (this.x < 450) {

            this.x += this.speed
        }
    }
    moveUp() {
        if (this.y > 0) {
            this.y -= this.speed
        }
    }
    moveDown() {
        if (this.y < 450) {
            this.y += this.speed
        }
    }
}

class Enemy extends Plane {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y)
        this.target = this.scene.player
        this.isTrace = isTrace
        this.timer = 0
        this.attackTime = 30
    }

    update() {
        this.updateTimer()
        this.updatePosition()
        if (this.timeToAttack()) {
            this.attack()
        }
        this.checkOutOfRange()
    }

    updateTimer() {
        this.timer++
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
        this.leaveTime = 300
    }

    isBuff() {
        var k = getRandomInt(0, 50)
        var isBuff = k == 9 ? true : false
        return isBuff
    }

    updatePosition() {
        if (this.timer < this.stopTime) {
            this.goForward()
        } else if (this.timer > this.leaveTime) {
            this.goBack()
        }
    }

    goBack() {
        this.y -= this.ySpeed
    }

    checkOutOfRange() {
        if (this.y < -100) {
            this.disappear()
        }
    }

}

// 碰撞攻击 可追踪
class ForlornHope extends Subordinate {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 80
        this.h = 50
        this.stopTime = 12
        this.attackSpeed = 25
        this.leaveTime = this.getLeaveTime()
        this.lives = 5

        // debug
        this.attackTime = 60
        // 追踪
        this.ySpeed = 20

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

    timeToAttack() {
        if (this.timer >= this.attackTime) {
            return true
        }
        return false
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


class Fighter extends Subordinate {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.stopTime = 30
        this.bulletSpeed = 10
        this.ySpeed = 1

        this.bulletCooling = 60

    }

    timeToAttack() {
        if (this.attackTime < this.timer && this.timer < this.leaveTime) {
            if ((this.timer - this.attackTime) % this.bulletCooling == 0) {
                return true
            }
        }
        return false
    }

    attack() {
        this.launch()
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
}
// 普通子弹 无发散 可追踪 子弹数1
class GeneralEnemy extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 120
        this.h = 60
        this.lives = 10
        // bullet
        this.bulletCount = 1
        this.bulletImageName = 'fireBullet'
    }
}
// 发散 可追踪
class Enemy1 extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 120
        this.h = 60
        this.lives = 20
        this.bulletImageName = 'fireBullet'
        this.bulletCount = 3
    }
}

class Enemy2 extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace=true) {
        super(game, scene, imgName, x, y, true)
        this.w = 60
        this.h = 60
        this.ySpeed = 0.3

        this.bulletImageName = 'fireBullet'
        this.bulletCount = 3

        this.backTime = 300
        this.backCooling = 120
        this.leaveTime = 800
    }

    updatePosition() {
        if (this.timeToBack()) {
            this.goBack()
        } else {
            this.goForward()
        }
    }

    timeToBack() {
        if (this.backTime < this.timer && this.timer < this.leaveTime) {
            var duration = this.backCooling/3
            if ((this.timer - this.backTime) % this.backCooling <= duration) {
                return true
            }
        }
        return false
    }

    checkOutOfRange() {
        if (this.y > this.scene.limitY) {
            this.disappear()
        }
    }

}

class Boss1 extends Enemy{
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 150
        this.h = 150
        this.ySpeed = 1

        this.bulletCount = 15
        // this.maxBulletCooling = 80
        this.bulletCooling = 80
        this.lives = 1000
        this.bulletImageName = 'fireBullet'
        this.stopTime = 50
        this.bulletSpeed = 15

        // 覆盖
        this.attackTime = 80

        //debug
        this.isTrace = false
    }

    updatePosition() {
        if (this.timer < this.stopTime) {
            this.goForward()
        }
    }

    attack() {
        this.launch()
    }

    timeToAttack() {
        if (this.timer >= this.attackTime) {
            if ((this.timer - this.attackTime) % this.bulletCooling == 0) {
                return true
            }
        }
        return false
    }

    checkOutOfRange() {}


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
        var radius = 60
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

class Boss2 extends Enemy{
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 80
        this.h = 80
        this.ySpeed = 1

        this.bulletCount = 15
        // this.maxBulletCooling = 80
        this.bulletCooling = 80
        this.lives = 100
        this.bulletImageName = 'fireBullet'
        this.stopTime = 50
        this.bulletSpeed = 5

        // 覆盖
        this.attackTime = 70
    }

    updatePosition() {
        if (this.timer < this.stopTime) {
            this.goForward()
        }
    }

    attack() {
        if ((this.timer - this.attackTime) % this.bulletCooling == 5) {
            this.launch1(30, 15, false, 'fireBullet')
        }
        this.launch1(10, 3, true, 'enemyBullet')

    }

    timeToAttack() {
        if (this.timer >= this.attackTime) {
            if ((this.timer - this.attackTime) % this.bulletCooling <= 5) {
                return true
            }
        }
        return false
    }

    checkOutOfRange() {}


    launch1(angle, bulletCount, isTrace, bulletImageName) {
        // var angle = 30
        // var bulletCount = 15
        // var isTrace = false
        var bulletDatas = this.bulletDatas(angle, bulletCount, isTrace)
        for (var b of bulletDatas) {
            var b = new EnemyBullet(this.game, this.scene, bulletImageName, b.x, b.y, b.xSpeed, b.ySpeed)
            this.scene.addElement(b)
        }
    }

    // launch2() {
    //     var angle = 10
    //     var bulletCount = 3
    //     var bulletDatas = this.bulletDatas(angle, bulletCount)
    //     for (var b of bulletDatas) {
    //         var b = new EnemyBullet(this.game, this.scene, this.bulletImageName, b.x, b.y, b.xSpeed, b.ySpeed)
    //         this.scene.addElement(b)
    //     }
    // }



    circleCenter() {
        var o = {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2,
        }
        return o
    }

    middleRadian(isTrace) {
        if (isTrace) {
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

    bulletDatas(angle, bulletCount, isTrace) {
        var radius = 20
        var stepLength = angle * Math.PI / 180
        var middle = this.middleRadian(isTrace)
        var count = Math.floor(bulletCount / 2)
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
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed
    }

    update() {
        this.updatePosition()
        this.checkShot()
        this.checkOutOfRange()
    }

    updatePosition() {
        this.move()
    }

    checkShot() {
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
            var sparkX = image.x + image.w / 2
            var sparkY = image.y + image.h / 2
            var spark = new Spark(this.game, this.scene, sparkX, sparkY)
            this.scene.addElement(spark)
        }
    }

}

class PlayerBullet extends Bullet {
    constructor(game, scene, bulletImageName, x, y, xSpeed, ySpeed) {
        super(game, scene, bulletImageName, xSpeed, ySpeed)
        this.target = 'Enemy'
        this.w = 15
        this.h = 15
        this.x = x - this.w / 2
        this.y = y - this.h / 2
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
        this.w = 15
        this.h = 15
        this.x = x - this.w / 2
        this.y = y - this.h / 2
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
        this.w = 600
        this.h = 600
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
