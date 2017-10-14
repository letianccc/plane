class Scene {
    constructor(game) {
        this.game = game
        this.elements = []
    }

    addElement(image) {
        this.elements.push(image)
    }

    update() {
        for (var i = 0; i < this.elements.length; i++) {
            var e = this.elements[i]
            e.update()
        }
    }
    draw() {
        for (var i = 0; i < this.elements.length; i++) {
            var e = this.elements[i]
            this.game.drawImage(e)
        }
    }
}

class MainScene extends Scene{
    constructor(game) {
        super(game)
        // log(game.scene)
        this.player = new Player(game, 'player')

        this.addElement(this.player)

        this.init_listener()
    }

    init_listener() {
        var p = this.player
        this.game.register("ArrowUp", function () {
            p.moveUp()
        })
        this.game.register("ArrowDown", function () {
            p.moveDown()
        })
        this.game.register("ArrowLeft", function () {
            p.moveLeft()
        })
        this.game.register("ArrowRight", function () {
            p.moveRight()
        })
        this.game.register("f", function () {
            p.launch()
        })
    }




}

//
// var Scene = function (game) {
//     var s = {
//         g: game
//     }
//
//     var player = Player(game)
//
//     var bullets = []
//
//     game.register("ArrowUp", function () {
//         player.moveUp()
//     })
//     game.register("ArrowDown", function () {
//         player.moveDown()
//     })
//     game.register("ArrowLeft", function () {
//         player.moveLeft()
//     })
//     game.register("ArrowRight", function () {
//         player.moveRight()
//     })
//     game.register("f", function () {
//         player.launch(bullets)
//     })
//
//     s.update = function () {
//         for (var i = 0; i < bullets.length; i++) {
//             bullets[i].move()
//         }
//     }
//
//     s.draw = function () {
//         game.drawImage(player)
//         for (var i = 0; i < bullets.length; i++) {
//             game.drawImage(bullets[i])
//         }
//     }
//
//     return s
// }
