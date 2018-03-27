class Player extends Plane {
    constructor(game, scene, imgName) {
        super(game, scene, 'player', 225, 430)
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
        for (var bulletData of bulletDatas) {
            var b = new PlayerBullet(this.game, this.scene, bulletData)
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
        if (this.y < 430) {
            this.y += this.speed
        }
    }
}
