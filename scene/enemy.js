


class Enemy extends Plane {
    constructor(game, scene, imgName, x, y, isTrace) {
        // var target = this.scene.player
        super(game, scene, imgName, x, y)
        // this.target = this.scene.player
    }

    updatePosition() {
        this.positionUpdator.updatePosition()
    }

    update() {
        this.updatePosition()
        this.attack()
        this.checkOutOfRange()
    }

    attack() {
        this.attackStrategy.attack()
    }
}

class Subordinate extends Enemy {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.isBuff = this.isBuff()
        // this.leaveTime = 300
    }

    isBuff() {
        var k = getRandomInt(0, 50)
        var isBuff = k == 9 ? true : false
        return isBuff
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
        this.lives = 5 * rate

        this.ySpeed = 20
        this.initPositionUpdator()
        this.initAttackStrategy(isTrace)
    }

    initAttackStrategy (isTrace) {
        var attackTime = 60
        var target = this.scene.player
        var attackSpeed = 25
        this.attackStrategy = new Crash(this, isTrace, attackTime, attackSpeed, target)
    }

    initPositionUpdator () {
        var stopTime = 18
        if (this.isTrace) {
            this.positionUpdator = new NoBack(this, stopTime)
        } else {
            var leaveTime = 100
            this.positionUpdator = new Fighter1(this, stopTime, leaveTime)
        }
    }

    updatePosition() {
        this.positionUpdator.updatePosition()
    }

    timeToAttack() {
        return this.timer > this.attackTime
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
        // this.bulletSpeed = 10
        this.ySpeed = 1
    }
}
// 普通子弹 无发散 可追踪 子弹数1
class GeneralEnemy extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 120
        this.h = 60
        this.lives = 10 * rate
        // bullet
        // this.bulletCount = 1
        this.positionUpdator = new Fighter1(this, 30, 300)
        // this.bulletImageName = 'fireBullet'
        this.initAttackStrategy(isTrace)
    }

    initAttackStrategy (isTrace) {
        var bulletCount = 3
        this.attackOn = new Fire(this, isTrace, bulletCount)
        this.attackOff = new NoAttack()
        this.attackStrategy = this.attackOff
    }

    updateAttackState () {
        if (this.attackTime < this.timer && this.timer < this.leaveTime) {
            this.attackStrategy = this.attackOn
        } else {
            this.attackStrategy = this.attackOff
        }
    }
}
// 发散 可追踪
class Enemy1 extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 120
        this.h = 60
        this.lives = 20 * rate
        this.initAttackStrategy(isTrace)
        this.initPositionUpdator()
    }

    initPositionUpdator () {
        var stopTime = 30
        var leaveTime = 300
        this.positionUpdator = new Fighter1(this, stopTime, leaveTime)
    }

    initAttackStrategy (isTrace) {
        var bulletCount = 3
        var bulletSpeed = 10
        var cool = 60
        var attackTime = 5
        var stopTime = 300
        var target = this.scene.player
        this.attackStrategy = new Fire(this, isTrace, bulletCount, bulletSpeed, cool, attackTime, stopTime, target)
    }

    timeToAttack () {
        return this.attackTime < this.timer && this.timer < this.leaveTime
    }
}

class Enemy2 extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace=true) {
        super(game, scene, imgName, x, y, true)
        this.w = 60
        this.h = 60
        this.ySpeed = 0.3

        // this.bulletImageName = 'fireBullet'
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

    goBack() {
        this.y -= this.ySpeed
    }

    goForward() {
        this.y += this.ySpeed
    }
}

class Boss1 extends Enemy{
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y-100, isTrace)
        this.w = 150
        this.h = 150
        this.ySpeed = 1

        this.lives = 100

        this.initAttackStrategy(isTrace)
        this.initPositionUpdator()
    }

    initPositionUpdator () {
        var stopTime = 160
        this.positionUpdator = new NoBack(this, stopTime)
    }

    initAttackStrategy (isTrace) {
        var bulletCount = 15
        var bulletSpeed = 15
        var cool = 80
        var attackTime = 180
        this.attackStrategy = new Boss1Attack(this, isTrace, bulletCount, bulletSpeed, cool, attackTime)
    }

    updatePosition() {
        this.positionUpdator.updatePosition()
    }

    checkOutOfRange() {}

}

class Boss2 extends Enemy{
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y-100, isTrace)
        this.w = 150
        this.h = 150
        this.ySpeed = 1


        this.lives = 10

        this.initAttackStrategy(isTrace)
        this.initPositionUpdator()
    }

    initPositionUpdator () {
        var stopTime = 160
        this.positionUpdator = new NoBack(this, stopTime)
    }

    initAttackStrategy (isTrace) {
        var bulletCount = 15
        var bulletSpeed = 15
        var cool = 80
        var attackTime = 180
        var target = this.scene.player
        this.attackStrategy = new Boss2Attack(this, isTrace, bulletCount, bulletSpeed, cool, attackTime, target)
    }

    updatePosition() {
        this.positionUpdator.updatePosition()
    }

    checkOutOfRange() {}

}
