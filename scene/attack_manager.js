
class AttackManager {
    constructor(enemy, isTrace, attackTime) {
        this.enemy = enemy
        this.isTrace = isTrace
        this.timer = 0
        this.attackTime = attackTime
    }

    updateTimer () {
        this.timer += 1
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

class BulletAttack extends Attack{
    constructor(enemy, isTrace, bulletCount, bulletSpeed, cool, attackTime) {
        super(enemy, isTrace, attackTime)
        this.bulletCount = bulletCount
        this.cool = cool
        this.bulletSpeed = bulletSpeed
    }

    attack () {
        this.updateTimer()
        if (this.timeToAttack()) {
            if (this.coolOver()) {
                this.launch()
            }
        }
    }

    timeToAttack() {
        return this.attackTime < this.timer && this.timer < this.stopTime
    }

    coolOver () {
        return this.timer % this.cool == 1
    }

    circleCenter() {
        var o = {
            x: this.enemy.x + this.enemy.w / 2,
            y: this.enemy.y + this.enemy.h / 2,
        }
        return o
    }

    middleRadian(isTrace) {
        if (isTrace) {
            var center = this.circleCenter()
            var target = {
                'x': this.target.x + this.enemy.w / 2,
                'y': this.target.y + this.enemy.h / 2,
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

}

class Fire extends BulletAttack {
    constructor(enemy, isTrace, bulletCount, bulletSpeed, cool, attackTime, stopTime, target) {
        super(enemy, isTrace, bulletCount, bulletSpeed, cool, attackTime)
        this.target = target
        this.stopTime = stopTime
    }

    launch() {
        var bulletDatas = this.bulletDatas(30, this.bulletCount, this.isTrace)
        for (var b of bulletDatas) {
            var b = new EnemyBullet(this.enemy.game, this.enemy.scene, b)
            this.enemy.scene.addElement(b)
        }
    }

}

class BossAttack extends BulletAttack {
    timeToAttack() {
        return this.timer > this.attackTime
    }
}

class Boss1Attack extends BossAttack {
    constructor(enemy, isTrace, bulletCount, bulletSpeed, cool, attackTime) {
        super(enemy, isTrace, bulletCount, bulletSpeed, cool, attackTime)
        // this.cool = 80
        // this.attackTime = attackTime
        // this.stopTime = enemy.leaveTime
    }

    launch() {
        var bulletDatas = this.bulletDatas(30, this.bulletCount, this.isTrace)
        for (var b of bulletDatas) {
            var b = new EnemyBullet(this.enemy.game, this.enemy.scene, b)
            this.enemy.scene.addElement(b)
        }
    }
}

class Boss2Attack extends BossAttack {
    constructor(enemy, isTrace, bulletCount, bulletSpeed, cool, attackTime, target) {
        super(enemy, isTrace, bulletCount, bulletSpeed, cool)
        this.attackTime = attackTime
        this.target = target

    }

    launch () {
        if (this.timer % this.cool == 5) {
            this.launch1(30, 15, false, 'fireBullet')
        }
        this.launch1(10, 3, true, 'enemyBullet')
    }

    launch1(angle, bulletCount, isTrace) {
        var bulletDatas = this.bulletDatas(angle, bulletCount, isTrace)
        for (var b of bulletDatas) {
            var b = new EnemyBullet(this.enemy.game, this.enemy.scene, b)
            this.enemy.scene.addElement(b)
        }
    }

    coolOver () {
        return this.timer % this.cool <= 5
    }
}

class Crash extends AttackManager{
    constructor(enemy, isTrace, attackTime, attackSpeed, target) {
        super(enemy, isTrace, attackTime)
        if (isTrace) {
            this.target = target
        }
        this.attackSpeed = attackSpeed
        this.setState = false
    }
    // 追踪算法有错误
    attack() {
        this.updateTimer()
        if (this.timer > this.attackTime) {
            if (this.isTrace) {
                if (!this.setState) {
                    this.setAttackState()
                }
                this.rapidCollide()
            }
        }

    }

    rapidCollide() {
        this.move()
    }

    setAttackState() {
        this.setState = true
        var speed = this.speed(this.enemy, this.target, this.attackSpeed)
        this.enemy.xSpeed = speed['x']
        this.enemy.ySpeed = speed['y']
    }

    move() {
        this.enemy.x += this.enemy.xSpeed
        this.enemy.y += this.enemy.ySpeed
    }

}
