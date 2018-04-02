class Bullet extends MyImage {
    constructor(game, scene, imgName, bulletData) {
        super(game, scene, imgName)
        this.w = 15
        this.h = 15
        this.xSpeed = bulletData.xSpeed
        this.ySpeed = bulletData.ySpeed
        this.x = bulletData.x - this.w / 2
        this.y = bulletData.y - this.h / 2
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
    constructor(game, scene, bulletData) {
        // imgName = 'fireBullet'
        super(game, scene, 'fireBullet', bulletData)
        this.target = 'Enemy'
        // this.w = 15
        // this.h = 15
        // this.x = bulletData.x - this.w / 2
        // this.y = bulletData.y - this.h / 2
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
    constructor(game, scene, bulletData) {
        super(game, scene, 'fireBullet', bulletData)
        this.target = 'Player'
    }

    move() {
        this.x += this.xSpeed
        this.y += this.ySpeed
    }

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
    }

    updatePosition() {
        this.move()
    }
}
