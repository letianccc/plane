class Fighter1 {
    constructor(enemy) {
        this.enemy = enemy
    }

    updatePosition() {
        if (this.enemy.timer < this.enemy.stopTime) {
            this.goForward()
        } else if (this.enemy.timer > this.enemy.leaveTime) {
            this.goBack()
        }
    }

    goBack() {
        this.enemy.y -= this.enemy.ySpeed
    }

    goForward() {
        this.enemy.y += this.enemy.ySpeed
    }
}

// class Fighter2 {
//     constructor(enemy) {
//         this.enemy = enemy
//     }
//
//     updatePosition() {
//         if (this.timeToBack()) {
//             this.goBack()
//         } else {
//             this.goForward()
//         }
//     }
//
//     timeToBack() {
//         if (this.enemy.backTime < this.enemy.timer && this.enemy.timer < this.enemy.leaveTime) {
//             var duration = this.enemy.backCooling/3
//             if ((this.enemy.timer - this.enemy.backTime) % this.enemy.backCooling <= duration) {
//                 return true
//             }
//         }
//         return false
//     }
//
//
//     goBack() {
//         this.enemy.y -= this.enemy.ySpeed
//     }
//
//     goForward() {
//         this.enemy.y += this.enemy.ySpeed
//     }
// }


class Enemy extends Plane {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y)
        this.target = this.scene.player
        this.isTrace = isTrace
        this.timer = 0
        this.attackTime = 30
    }

    updatePosition() {
        this.positionUpdator.updatePosition()
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
        this.stopTime = 18
        this.attackSpeed = 25
        this.leaveTime = this.getLeaveTime()
        this.lives = 5 * rate

        // debug
        this.attackTime = 60
        // 追踪
        this.ySpeed = 20

        this.positionUpdator = new Fighter1(this)

    }

    updatePosition() {
        this.positionUpdator.updatePosition()
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
            var b = new EnemyBullet(this.game, this.scene, b)
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
        this.lives = 10 * rate
        // bullet
        this.bulletCount = 1
        this.positionUpdator = new Fighter1(this)
        // this.bulletImageName = 'fireBullet'
    }
}
// 发散 可追踪
class Enemy1 extends Fighter {
    constructor(game, scene, imgName, x, y, isTrace) {
        super(game, scene, imgName, x, y, isTrace)
        this.w = 120
        this.h = 60
        this.lives = 20 * rate
        // this.bulletImageName = 'fireBullet'
        this.bulletCount = 3
        this.positionUpdator = new Fighter1(this)
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

        this.bulletCount = 15
        // this.maxBulletCooling = 80
        this.bulletCooling = 80
        this.lives = 100
        this.bulletImageName = 'fireBullet'
        this.stopTime = 160
        this.bulletSpeed = 15

        // 覆盖
        this.attackTime = 180

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
            var b = new EnemyBullet(this.game, this.scene, b)
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
        super(game, scene, imgName, x, y-100, isTrace)
        this.w = 150
        this.h = 150
        this.ySpeed = 1

        this.bulletCount = 15
        // this.maxBulletCooling = 80
        this.bulletCooling = 80
        this.lives = 10
        this.bulletImageName = 'fireBullet'
        this.stopTime = 160
        this.bulletSpeed = 15

        // 覆盖
        this.attackTime = 180
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
            var b = new EnemyBullet(this.game, this.scene, b)
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
