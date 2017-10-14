class Scene {
    constructor(game) {
        this.game = game
        this.elements = {
            'Background': [],
            'Enemy': [],
            'Player': [],
            'Bullet': [],
        }
    }

    bullets() {
        return this.elements['Bullet']
    }

    addElement(image) {
        this.elements[image.constructor.name].push(image)
    }

    update() {
        for (var imageKind of Object.keys(this.elements)) {
            for (var img of this.elements[imageKind]) {
                img.update()
            }
        }
    }

    draw() {
        for (var imageKind of Object.keys(this.elements)) {
            for (var img of this.elements[imageKind]) {
                if (img.alive == true) {
                    this.game.drawImage(img)
                }

            }
        }
    }
}

class MainScene extends Scene{
    constructor(game) {
        super(game)

        this.bg1 = new Background(game, 'background')
        this.bg2 = new Background(game, 'background')
        this.bg1.y = 0
        this.bg2.y = -this.bg2.h
        this.player = new Player(game, 'player')
        this.enemy = new Enemy(game, 'enemy')

        this.addElement(this.bg1)
        this.addElement(this.bg2)
        this.addElement(this.player)
        this.addElement(this.enemy)

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
