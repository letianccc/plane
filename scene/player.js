
// class Player extends MyImage{
//     constructor(game, imgName) {
//         super(game, imgName)
//         this.x = 120
//         this.y = 130
//         this.w = 20
//         this.h = 20
//         this.speed = 5
//         this.scene = game.scene
//     }
//
//     launch() {
//         var b = new Bullet(this.game)
//         b.y = o.y
//         b.x = o.x + 8
//         this.scene.addElement(b)
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
// }







// var Player = function (game) {
//     var image = game.imageByName('player')
//     var o = {
//         image: image,
//         x: 120,
//         y: 130,
//         width: 20,
//         height: 20,
//         speed: 5,
//     }
//
//     o.launch = function (bullets) {
//         var b = Bullet(game)
//         b.y = o.y
//         b.x = o.x + 8
//         bullets.push(b)
//     }
//
//     o.moveLeft = function () {
//         o.x -= o.speed
//     }
//     o.moveRight = function () {
//         o.x += o.speed
//     }
//     o.moveUp = function () {
//         o.y -= o.speed
//     }
//     o.moveDown = function () {
//         o.y += o.speed
//     }
//
//     return o
// }
