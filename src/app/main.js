require('./main.css');
import Menu from './lib/ui/menu.js';
import Peer from 'peerjs';
import Game from './lib/game/game.js';
import Input from './lib/game/input.js';

const PEERJS_API_KEY = 'f6z3bf58hdwsif6r';

if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body)
    run();
else
    window.addEventListener('DOMContentLoaded', run, false);

function run() {
    document.getElementById('all_containers').style.display = 'block';
    
    const peer = new Peer({key: PEERJS_API_KEY});
    const input = new Input();
    input.bind();

    peer.on('open', function(id) {
        console.log('PeerJS: '+id);
        Menu.bind(id, ()=>{
            let hostID = id;
            const guests = [];
            let players = Menu.players;
            for (let playerID in players)
                if (hostID != playerID) {
                    guests[playerID] = {id:playerID,name:players[playerID],conn:peer.connect(playerID)};
                    let conn = guests[playerID].conn;
                    ((guestID)=> {
                        console.log(guestID);
                        conn.on('open', ()=> {
                            conn.send({a:"identify",hostID,players},{reliable:true});
                            console.log('Connected guest: ' + guestID);
                        });
                        conn.on('data',data=>{
                            game.receiveData(guestID,data);
                        });
                    })(playerID);
                }
            let game = new Game(input,true,hostID,Menu.playerID,players,guests);
        });
    });
    peer.on('connection',conn=>{
        Menu.guestStart();
        let hostID = '';
        let players = [];
        let game = null;
        hostID = conn.peer;
        conn.on('data',data=>{
            if (data.a == 'identify') {
                hostID = data.hostID;
                players = data.players;
                console.log(conn);
                game = new Game(input,false,hostID,Menu.playerID,players,conn);
                console.log(`Connected to host: ${hostID}`);
            }
            else if (!hostID)
                throw new Error('cannot send data before host is identified');
            else
                game.receiveData(hostID,data);
        });
    });
}

