
class Game{
    constructor(fps, images, callback){
        this.fps = fps
        this.actions = {}
        this.keydowns = {}
        this.images = {}
        this.canvas = document.getElementById('canvas')
        this.context = this.canvas.getContext('2d')
        this.callback = callback
        this.start = false

        this.load(images)
        this.initListener()
    }

    startMainScene() {
        this.clearActions()
        this.scene = new MainScene(this)
    }

    startEndScene() {
        this.clearActions()
        this.scene = new StartScene(this)
    }

    clearStartScene() {
        delete this.actions['s']
    }

    clearActions() {
        var keys = Object.keys(this.actions)
        for (var k of keys) {
            delete this.actions[k]
        }
    }

    imageByName(imageName) {
        var img = this.images[imageName]
        return img
    }

    update() {
        this.scene.update()
    }

    clearImage() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    draw() {
        this.scene.draw()
    }

    drawImage(image) {
        // log('r')
        this.context.drawImage(image.img, image.x, image.y, image.w, image.h)
    }

    register(key, callback) {
        this.actions[key] = callback
    }

    load(images) {
        // this.initListener()
        this.loadImage(images)
    }

    initListener() {
        var g= this
        window.addEventListener('keydown', function(event){
            g.keydowns[event.key] = true
        })
        window.addEventListener('keyup', function(event){
            g.keydowns[event.key] = false
        })
        window.addEventListener('click', function(event){
            // log(event.screenX, event.screenY)
        })
    }

    loadImage(images) {
        var g= this
        var count = 0
        var names = Object.keys(images)
        for (var i = 0; i < names.length; i++) {
            var name = names[i]
            var path = images[name]
            var img = new Image()
            img.src = path
            this.images[name] = img
            img.onload = function () {
                count++
                if (count == names.length) {
                    g.run()
                }
            }
        }
    }

    listen() {
        var actions = Object.keys(this.actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i]
            if (this.keydowns[key]) {
                this.actions[key]()
            }
        }
    }

    runLoop() {
        this.listen()
        this.update()
        this.clearImage()
        this.draw()
    }

    run() {
        var g = this
        this.callback(this)

        setInterval(function () {
            g.runLoop()
        }, 1000/this.fps)
    }
}
