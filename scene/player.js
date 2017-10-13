var Player = function (game) {
    var image = game.imageByName('player')
    var o = {
        image: image,
        x: 120,
        y: 130,
        width: 20,
        height: 20,
        speed: 5,
    }

    o.launch = function (bullets) {
        var b = Bullet(game)
        b.y = o.y
        b.x = o.x + 8
        bullets.push(b)
    }

    o.moveLeft = function () {
        o.x -= o.speed
    }
    o.moveRight = function () {
        o.x += o.speed
    }
    o.moveUp = function () {
        o.y -= o.speed
    }
    o.moveDown = function () {
        o.y += o.speed
    }

    return o
}