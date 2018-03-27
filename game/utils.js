var log = console.log.bind(console)

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function isCollide(a, b) {
    if (a.x >= b.x && a.x >= b.x + b.w) {
        return false;
    } else if (a.x <= b.x && a.x + a.w <= b.x) {
        return false;
    } else if (a.y >= b.y && a.y >= b.y + b.h) {
        return false;
    } else if (a.y <= b.y && a.y + a.h <= b.y) {
        return false;
    }

    return true
}



