class MyImage {
    constructor(game, imgName) {
        this.img = game.imageByName(imgName)
        this.x = 0
        this.y = 0
        this.w = this.img.width
        this.h = this.img.height
    }

    update() {}
    draw() {}
}

class Player extends MyImage{
    constructor(game, imgName) {
        super(game, imgName)
        this.game = game
        this.x = 120
        this.y = 130
        this.w = 20
        this.h = 20
        this.speed = 5
    }

    launch() {
        var b = new Bullet(this.game, 'bullet')
        b.y = this.y
        b.x = this.x + 8
        this.game.scene.addElement(b)
    }

    moveLeft() {
        this.x -= this.speed
    }
    moveRight() {
        this.x += this.speed
    }
    moveUp() {
        this.y -= this.speed
    }
    moveDown() {
        this.y += this.speed
    }

    draw() {}
}

class Bullet extends MyImage{
    constructor(game, imgName) {
        super(game, imgName)
        this.x = 20
        this.y = 120
        this.w = 3
        this.h = 3
        this.speed = 5
    }

    update() {
        this.y -= this.speed
    }
}





// class Player extends MyImage{
//     constructor(game, imgName) {
//         super(game, imgName)
//         this.x = 120
//         this.y = 130
//         this.w = 20
//         this.h = 20
//         this.speed = 5
//     }
//
//     launch() {
//         var b = Bullet(this.game)
//         b.y = o.y
//         b.x = o.x + 8
//     }
//
//     update() {
//
//     }
//
//     moveLeft() {
//         this.x -= this.speed
//     }
//     moveRight() {
//         this.x += this.speed
//     }
//     moveUp() {
//         this.y -= this.speed
//     }
//     moveDown() {
//         this.y += this.speed
//     }
//
//     draw() {}
//
//
//
//
// }
