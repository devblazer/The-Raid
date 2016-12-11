import Phaser from 'phaser-shim';
import Warrior from './actors/warrior.js';
import Util from './../Util.js';

const WIDTH = 400;
const HEIGHT = 250;
const ASPECT = HEIGHT/WIDTH;

export default class Game {
    constructor(input,isHost,hostID,playerID,players,conn) {
        const p = this._private = {
            isHost,
            hostID,
            players,
            playerID,
            guestConns: isHost?conn:[],
            hostConn: isHost?null:conn,
            input,
            playerObjs: {},
            phaser: null,
            time: 0
        };

        for (let playerID in p.players)
            p.playerObjs[playerID] = new Warrior(playerID, Math.random() * 0, Math.random() * 0);
        p.player = p.playerObjs[p.playerID];

        p.phaser = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'phaser-example', {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this)
        });
    }

    performResize() {
        let ww = window.innerWidth;
        let wh = window.innerHeight;
        let wa = wh/ww;
        let xo=0, yo=0, w=0, h=0;

        if (wa < ASPECT) {
            h = wh;
            w = h/ASPECT;
            xo = (ww-w)/2
        }
        else {
            w = ww;
            h = w*ASPECT;
            yo = (wh-h)/2;
        }

        let canvas = document.querySelector('canvas');
        //canvas.width = w;
        //canvas.height = h
        document.body.style.paddingTop = yo+'px';
        //canvas.style.marginLeft = xo;
    }

    preload() {
        const p = this._private;

        p.phaser.load.spritesheet('warrior', '/textures/warrior.png', 18, 18);
    }

    create() {
        const p = this._private;
        const me = this;
        p.phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        p.phaser.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        p.phaser.input.onDown.add(()=>{
            if (!p.phaser.scale.isFullScreen) {
                p.phaser.scale.startFullScreen(false);
                me.performResize();
            }
        }, this);
        window.addEventListener('resize',this.performResize);

        p.time = (new Date()).getTime();

        for (let playerID in p.players)
            p.playerObjs[playerID].draw(p.phaser);
    }

    update() {
        const p = this._private;

        let newTime = (new Date()).getTime();
        let delta = (newTime - p.time) / 1000;
        p.time = newTime;

        this.step(delta);
        this.collisions(delta);
        this.render(delta);
        this.sendData(delta);
    }

    step(delta) {
        const p = this._private;
        let keyStates = p.input.getKeyStates();

        for (let i in p.playerObjs)
            p.playerObjs[i].step(delta,i==p.playerID?keyStates:null);
    }

    collisions(delta) {
        const p = this._private;

    }

    render(delta) {
        const p = this._private;

        for (let i in p.playerObjs)
            p.playerObjs[i].render(delta);
    }
    
    sendData(delta) {
        const p = this._private;
        let time = (new Date()).getTime();

        if (p.isHost) {
            let playerMoveData = [];
            for (let i in p.playerObjs)
                playerMoveData.push({t:time,i,x:p.playerObjs[i].x,y:p.playerObjs[i].y,f:p.playerObjs[i].facing,xs:p.playerObjs[i].xSpeed,ys:p.playerObjs[i].ySpeed,c:p.playerObjs[i].currentAction,g:p.playerObjs[i].isGuarding});

            for (let g in p.guestConns) {
                p.guestConns[g].conn.send({
                    a:'pp',
                    d:playerMoveData.filter(data=>{
                        return data.i != g;
                    })
                });
            }
        }
        else {
            p.hostConn.send({t:time,a:'pp',x:p.player.x,y:p.player.y,f:p.player.facing,xs:p.player.xSpeed,ys:p.player.ySpeed,c:p.player.currentAction,g:p.player.isGuarding});
        }
    }

    receiveData(playerID,data) {
        const p = this._private;

        if (p.isHost)
            switch (data.a) {
                case 'pp':
                    p.playerObjs[playerID].setPos(data);
                    break;
            }
        else 
            switch (data.a) {
                case 'pp':
                    data.d.forEach(playerData=>{
                        p.playerObjs[playerData.i].setPos(playerData);
                    });
                    break;
            }
    }
}