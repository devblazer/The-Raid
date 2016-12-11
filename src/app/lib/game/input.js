import Util from './../Util.js';

const handleKeyup = function(e) {
    let keyCode = e.which || e.keyCode;
    if (KEYS[keyCode]) {
        this._private.keyStates[KEYS[keyCode]] = false;
        this._private.keyPresses[KEYS[keyCode]]++;
    }
    if (KEYS[keyCode]=='debug')
        Util.activateDebugKey();
};
const handleKeydown = function(e) {
    let keyCode = e.which || e.keyCode;
    if (KEYS[keyCode])
        this._private.keyStates[KEYS[keyCode]] = true;
};

const KEYS = {
    38:'up',
    40:'down',
    37:'left',
    39:'right',
    68:'primary',
    83:'secondary',
    65:'tertiary',
    32:'defend',
    16:'aim',
    192:'debug'
};

export default class Input {
    constructor() {
        const p = this._private = {
            keyStates:{
            },
            keyPresses:{
            }
        };
        for (let k in KEYS) {
            p.keyStates[KEYS[k]] = false;
            p.keyPresses[KEYS[k]] = 0;
        }
    }

    bind() {
        document.addEventListener('keyup',handleKeyup.bind(this),true);
        document.addEventListener('keydown',handleKeydown.bind(this),true);
    }
    unbind() {
        document.removeEventListener('keyup',handleKeyup.bind(this));
        document.removeEventListener('keydown',handleKeydown.bind(this));
    }

    getKeyStates() {
        return {...this._private.keyStates};
    }
    getKeyPress(key,clear=false) {
        const p = this._private;
        let ret = p.keyPresses[key];

        if (clear)
            p.keyPresses[key] = 0;
        return ret;
    }
    getKeyPresses(clear=false) {
        const p = this._private;
        let ret = {...p.keyPresses};

        if (clear) {
            for (let k in p.keyPresses)
                p.keyPresses[k] = 0;
        }
        return ret;
    }
}