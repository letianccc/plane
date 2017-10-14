class Game{

    constructor(images, callback){
        this.actions = {}
        this.keydowns = {}
        this.images = {}
        this.canvas = document.getElementById('canvas')
        this.context = this.canvas.getContext('2d')
        this.callback = callback

        this.init(images)
    }

    imageByName(imageName) {
        var img = this.images[imageName]
        return img
    }

    update() {
        this.scene.update()
    }

    draw() {
        this.scene.draw()
    }

    drawImage(image) {
        this.context.drawImage(image.img, image.x, image.y, image.w, image.h)
        // this.context.drawImage(image.image, image.x, image.y, image.width, image.height)
    }

    register(key, callback) {
        this.actions[key] = callback
    }

    init(images) {
        var g= this

        window.addEventListener('keydown', function(event){
            g.keydowns[event.key] = true
        })
        window.addEventListener('keyup', function(event){
            g.keydowns[event.key] = false
        })

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

    runLoop() {
        var actions = Object.keys(this.actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i]
            if (this.keydowns[key]) {
                this.actions[key]()
            }
        }
        // update
        this.update()
        // clear
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // draw
        this.draw()
    }

    run() {
        var g = this
        this.callback(this)
        log(g.scene)
        setInterval(function () {
            g.runLoop()
        }, 1000/30)
    }


}

//
// var Game = function (images, callback) {
//     var g = {
//         actions: {},
//         keydowns: {},
//         images: {},
//     }
//
//     g.canvas = document.getElementById('canvas')
//     g.context = g.canvas.getContext('2d')
//
//     g.imageByName = function (imageName) {
//         var img = g.images[imageName]
//         return img
//     }
//
//     g.update = function () {
//         g.scene.update()
//     }
//
//     g.draw = function () {
//         g.scene.draw()
//     }
//
//     // draw
//     g.drawImage = function (image) {
//         g.context.drawImage(image.image, image.x, image.y, image.width, image.height)
//     }
//     // events
//     window.addEventListener('keydown', function(event){
//         g.keydowns[event.key] = true
//     })
//     window.addEventListener('keyup', function(event){
//         g.keydowns[event.key] = false
//     })
//     // register
//     g.register = function (key, callback) {
//         g.actions[key] = callback
//     }
//     // timer
//     var count = 0
//     var names = Object.keys(images)
//     for (var i = 0; i < names.length; i++) {
//         var name = names[i]
//         var path = images[name]
//         var img = new Image()
//         img.src = path
//         g.images[name] = img
//         img.onload = function () {
//             count++
//             if (count == names.length) {
//                 g.run()
//             }
//         }
//     }
//
//     g.runLoop = function () {
//         // events
//         var actions = Object.keys(g.actions)
//         for (var i = 0; i < actions.length; i++) {
//             var key = actions[i]
//             if (g.keydowns[key]) {
//                 g.actions[key]()
//             }
//         }
//         // update
//         g.update()
//         // clear
//         g.context.clearRect(0, 0, g.canvas.width, g.canvas.height);
//         // draw
//         g.draw()
//     }
//
//     g.run = function () {
//         g.scene = callback(g)
//         setInterval(function () {
//             g.runLoop()
//         }, 1000/30)
//     }
//
//     return g
// }
