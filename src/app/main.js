require('./main.css');
import Menu from './lib/ui/menu.js';
import Peer from 'peerjs';

const PEERJS_API_KEY = 'f6z3bf58hdwsif6r';

if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body)
    run();
else
    window.addEventListener('DOMContentLoaded', run, false);

function run() {
    const peer = new Peer({key: PEERJS_API_KEY});
    peer.on('open', function(id) {
        Menu.bind(id, ()=>{
            let hostID = id;
            const guests = [];
            let players = Menu.players;
            for (let playerID in players)
                if (hostID != playerID) {
                    guests[playerID] = {id:playerID,name:players[playerID],conn:peer.connect(playerID)};
                    let conn = guests[playerID].conn;
                    ((guestID)=> {
                        conn.on('open', ()=> {
                            conn.send({"action":"identify","hostID":hostID},{reliable:true});
                            console.log('Connected guest: ' + guestID);
                        });
                    })(playerID);
                }

            console.log('host game for:', Menu.players);
        });
    });
    peer.on('connection',conn=>{
        let hostID = '';
        conn.on('data',data=>{
            if (data.action == 'identify') {
                hostID = data.hostID;
                console.log(`Connected to host: ${hostID}`);
            }
            else if (!hostID)
                throw new Error('cannot send data before host is identified');
        });
    });
}

