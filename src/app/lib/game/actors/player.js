import Character from './character.js';

export default class Player extends Character {
    constructor(id, x=0, y=0, facing=0) {
        super(true, x, y, facing, id);

        const p = this._private = {
            ...this._private
        };
    }

    step(delta,keyStates) {
        const p = this._private;
        super.step(delta,keyStates);
    }
}