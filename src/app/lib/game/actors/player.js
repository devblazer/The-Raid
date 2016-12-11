import Character from './character.js';

export default class Player extends Character {
    constructor(id, x=0, y=0, facing=0) {
        super(true, x, y, facing, id);

        const p = this._private = {
            ...this._private
        };
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