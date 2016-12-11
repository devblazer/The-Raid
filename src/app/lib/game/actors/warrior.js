import Player from './player.js';

export default class Warrior extends Player {
    constructor(id, x=0, y=0, facing=0) {
        super(id, x, y, facing);

        const p = this._private = {
            ...this._private,
            moveSpeed:50,
            spriteOffsetX:1,
            spriteOffsetY:-6,
            isWalking:false,
            horizontal:1
        };
    }

    draw(phaser) {
        const p = this._private;

        p.sprite = phaser.add.sprite(p.x, p.y, 'warrior');
        p.sprite.anchor.setTo(0.5,0.5);

        p.sprite.animations.add('stand',[0],10,false);
        p.sprite.animations.add('walk',[1,2,1,0],8,true);

        p.sprite.animations.play('stand');
    }

    render() {
        const p = this._private;
        super.render();

        if ((p.xSpeed || p.ySpeed) && !p.isWalking) {
            p.isWalking = true;
            p.sprite.animations.play('walk');
        }
        else if (!p.xSpeed && !p.ySpeed && p.isWalking) {
            p.isWalking = false;
            p.sprite.animations.play('stand');
        }
        if (p.xSpeed<0 && p.horizontal==1)
            p.horizontal = p.sprite.scale.x = -1;
        else if (p.xSpeed>0 && p.horizontal==-1)
            p.horizontal = p.sprite.scale.x = 1;
    }

    processInput(delta, keyStates) {
        const p = this._private;
        p.xSpeed = ((keyStates.left?-1:0)+(keyStates.right?+1:0))*p.moveSpeed;
        p.ySpeed = ((keyStates.up?-1:0)+(keyStates.down?+1:0))*p.moveSpeed;
    }

    step(delta) {
        const p = this._private;
        super.step(delta);
    }
}