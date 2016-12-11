import Player from './player.js';

export default class Warrior extends Player {
    constructor(id, x=0, y=0, facing=0) {
        super(id, x, y, facing);

        const p = this._private = {
            ...this._private,
            moveSpeed:50,
            chargeSpeed:200,
            spriteOffsetX:1,
            spriteOffsetY:-6,
            isWalking:false,
            horizontal:1,
            isGuarding:false,
            currentAction:null,
            lastAction:0,
            hurtDuration:0.5,
            stabDuration:0.6,
            chargeDuration:0.33
        };
    }

    get isGuarding() {
        return this._private.isGuarding;
    }
    get currentAction() {
        return this._private.currentAction;
    }

    draw(phaser) {
        const p = this._private;

        p.sprite = phaser.add.sprite(p.x, p.y, 'warrior');
        p.sprite.anchor.setTo(0.5,0.5);

        p.sprite.animations.add('stand',[0],10,false);
        p.sprite.animations.add('walk',[1,2,1,0],12,true);
        p.sprite.animations.add('stab',[3,4,3,0],12,false);
        p.sprite.animations.add('hurt',[5,6,5,0],8,false);
        p.sprite.animations.add('charge',[7],10,false);
        p.sprite.animations.add('guard',[8],10,false);
        p.sprite.animations.add('shuffle',[9,10,9,8],8,true);
        p.sprite.animations.add('jab',[11,12,11,8],12,false);

        p.sprite.animations.play('stand');
    }

    render() {
        const p = this._private;
        super.render();

        if (!p.currentAction) {
            if ((p.xSpeed || p.ySpeed) && !p.isWalking) {
                p.isWalking = true;
                if (p.isGuarding)
                    p.sprite.animations.play('shuffle');
                else
                    p.sprite.animations.play('walk');
            }
            else if (!p.xSpeed && !p.ySpeed && p.isWalking) {
                p.isWalking = false;
                if (p.isGuarding)
                    p.sprite.animations.play('guard');
                else
                    p.sprite.animations.play('stand');
            }
        }
        if (p.xSpeed<0 && p.horizontal==1)
            p.horizontal = p.sprite.scale.x = -1;
        else if (p.xSpeed>0 && p.horizontal==-1)
            p.horizontal = p.sprite.scale.x = 1;
    }

    step(delta,keyStates) {
        const p = this._private;
        let time = (new Date()).getTime();

        if (keyStates) {
            if (!p.isGuarding && keyStates.defend) {
                p.isGuarding = true;
                if (!p.currentAction) {
                    p.isWalking = false;
                    p.sprite.animations.play('guard');
                }
            }
            else if (p.isGuarding && !keyStates.defend) {
                p.isGuarding = false;
                if (!p.currentAction) {
                    p.isWalking = false;
                    p.sprite.animations.play('stand');
                }
            }

            if (!p.currentAction && keyStates.primary) {
                p.currentAction = 'stab';
                p.xSpeed = p.ySpeed = 0;
                p.isWalking = false;
                p.lastAction = time;
                if (p.isGuarding)
                    p.sprite.animations.play('jab');
                else
                    p.sprite.animations.play('stab');
            }
            else if (p.currentAction == 'stab' && time - p.lastAction > p.stabDuration * 1000) {
                p.currentAction = null;
                if (p.isGuarding)
                    p.sprite.animations.play('guard');
                else
                    p.sprite.animations.play('stand');
            }
            if (!p.currentAction && keyStates.secondary && (p.xSpeed || p.ySpeed)) {
                p.currentAction = 'charging';
                p.xSpeed *= (p.chargeSpeed / p.moveSpeed * (p.isGuarding ? 2 : 1));
                p.ySpeed *= (p.chargeSpeed / p.moveSpeed * (p.isGuarding ? 2 : 1));
                p.isWalking = false;
                p.lastAction = time;
                p.sprite.animations.play('charge');
            }
            else if (p.currentAction == 'charging' && time - p.lastAction > p.chargeDuration * 1000) {
                p.currentAction = null;
                if (p.isGuarding)
                    p.sprite.animations.play('guard');
                else
                    p.sprite.animations.play('stand');
            }

            if (!p.currentAction) {
                p.xSpeed = ((keyStates.left ? -1 : 0) + (keyStates.right ? +1 : 0)) * p.moveSpeed * (p.isGuarding ? 0.5 : 1);
                p.ySpeed = ((keyStates.up ? -1 : 0) + (keyStates.down ? +1 : 0)) * p.moveSpeed * (p.isGuarding ? 0.5 : 1);
            }
        }

        super.step(delta,keyStates);
    }

    setPos(data) {
        const p = this._private;
        let time = (new Date()).getTime();

        if (!p.isGuarding && data.g) {
            p.isGuarding = true;
            if (!p.currentAction) {
                p.isWalking = false;
                p.sprite.animations.play('guard');
            }
        }
        else if (p.isGuarding && !data.g) {
            p.isGuarding = false;
            if (!p.currentAction) {
                p.isWalking = false;
                p.sprite.animations.play('stand');
            }
        }

        if (p.currentAction != data.c) {
            switch (data.c) {
                case null:
                    p.currentAction = null;
                    if (p.isGuarding)
                        p.sprite.animations.play('guard');
                    else
                        p.sprite.animations.play('stand');
                    p.isWalking = false;
                    break;
                case 'charging':
                    p.currentAction = 'charging';
                    p.isWalking = false;
                    p.lastAction = time;
                    p.sprite.animations.play('charge');
                    break;
                case 'stab':
                    p.currentAction = 'stab';
                    p.isWalking = false;
                    p.lastAction = time;
                    if (p.isGuarding)
                        p.sprite.animations.play('jab');
                    else
                        p.sprite.animations.play('stab');
                    break;
            }
        }

        p.x = data.x;
        p.y = data.y;
        p.facing = data.f;
        p.xSpeed = data.xs;
        p.ySpeed = data.ys;
    }
}