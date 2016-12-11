import Util from './../Util.js';

export default class Character {
    constructor(isEnemy=true, x=0, y=0, facing=0, id=null) {
        id = id || Util.uid(16);
        const p = this._private = {
            id,
            isEnemy,
            x,
            y,
            lastX:x,
            lastY:y,
            xSpeed:0,
            ySpeed:0,
            facing
        }
    }

    draw(phaser) {
        const p = this._private;
        p.sprite = phaser.add.sprite(p.x, p.y, 'stone');
    }
    
    step(delta) {
        const p = this._private;

        p.lastX = p.x;
        p.lastY = p.y;
        p.x += p.xSpeed*delta;
        p.y += p.ySpeed*delta;
    }

    render() {
        const p = this._private;
        p.sprite.x = p.x;
        p.sprite.y = p.y;
    }

    get x() {
        return this._private.x;
    }
    get y() {
        return this._private.y;
    }
    get facing() {
        return this._private.facing;
    }
    get xSpeed() {
        return this._private.xSpeed;
    }
    get ySpeed() {
        return this._private.ySpeed;
    }

    setPos(data) {
        const p = this._private;
        p.x = data.x;
        p.y = data.y;
        p.facing = data.f;
        p.xSpeed = data.xs;
        p.ySpeed = data.ys;
    }
}