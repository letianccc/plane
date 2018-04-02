
class Fighter1 {
    constructor(enemy, stopTime, leaveTime) {
        this.enemy = enemy
        this.stopTime = stopTime
        this.leaveTime = leaveTime
        this.timer = 0
    }

    updatePosition() {
        this.updateTimer()
        if (this.timer < this.stopTime) {
            this.goForward()
        } else if (this.timer > this.leaveTime) {
            this.goBack()
        }
    }

    updateTimer () {
        this.timer += 1
    }

    goBack() {
        this.enemy.y -= this.enemy.ySpeed
    }

    goForward() {
        this.enemy.y += this.enemy.ySpeed
    }
}


class NoBack {
    constructor(enemy, stopTime) {
        this.enemy = enemy
        this.stopTime = stopTime
        this.timer = 0
    }

    updatePosition() {
        this.updateTimer()
        if (this.timer < this.stopTime) {
            this.goForward()
        }
    }

    updateTimer () {
        this.timer += 1
    }

    goForward() {
        this.enemy.y += this.enemy.ySpeed
    }
}
