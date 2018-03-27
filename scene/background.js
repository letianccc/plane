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
