import Util from './../Util.js';
import API from './../data/api.js';

const loading = ()=>{
    closeMenus();
    document.body.className = 'loading';
};
const closeMenus = ()=>{
    document.querySelectorAll('.menu').forEach(el=>{
        el.className = 'menu';
    });
};
const openMenu = id=>{
    closeMenus();
    document.body.className = '';
    document.getElementById(id).className += ' open';
};

const handleCreateGame = function(){
    const p = this._private;
    const me = this;
    p.gameName = document.getElementById('inp_gameName').value;
    if (!p.gameName.replace(/\s+/g,'')) {
        alert('Game name required');
        return;
    }
    p.gameID = Util.uid();
    p.password = document.getElementById('inp_hostPassword').value;
    loading();
    API.newGame(res=>{
        if (res)
            openPlayers.call(me);
        else {
            alert('failed to create game');
            handleCreateGame.call(me);
        }
    }, p.playerID, p.playerName, p.gameID, p.gameName, p.password);
};

const refreshGames = function() {
    let games = this._private.games;
    document.getElementById('lst_games').innerHTML = games.reduce((aggr,game)=>{
        return `${aggr}<li rel="${game.gameID}">${game.gameName} (${game.hostName})${game.hasPassword?' - password protected':''}</li>`;
    },'');
};

const joinGame = function() {
    const p = this._private;
    const me = this;

    loading();
    API.joinGame(res=> {
        if (res=='password') {
            alert('password incorrect');
            document.getElementById('inp_joinPassword').value = '';
            openMenu('mnu_password');
        }
        else if (res) {
            p.gameName = res;
            openPlayers.call(me);
        }
        else {
            refreshGames.call(me);
            alert('failed to join games');
            openMenu('mnu_games');
        }
    }, p.playerID, p.playerName, p.gameID, p.password);
};

const refreshPlayers = function(callback) {
    const p = this._private;
    API.listPlayers(res=>{
        if (res) {
            p.players = res;
            document.getElementById('lst_players').innerHTML = res.reduce((aggr,player)=>{
                return `${aggr}<li rel="${player.playerID}">${player.playerName}${player.isReady?' - ready':''}</li>`;
            },'');
            if (callback)
                callback(true);
        }
        else if (callback)
            callback(false);
    }, p.gameID, p.playerID);
};

const openPlayers = function() {
    const p = this._private;
    const me = this;
    loading();
    const refreshPlayersCallback = function(res) {
        if (res)
            window.setTimeout(()=>{
                refreshPlayers.call(me,refreshPlayersCallback);
            },1000);
        else {
            if (p.isHost) {
                alert('failed to create player list');
                openMenu('mnu_host');
            }
            else {
                alert('failed to fetch player list');
                openMenu('mnu_games');
            }
        }
    };
    refreshPlayers.call(me,res=>{
        refreshPlayersCallback(res);
        if (res) {
            document.getElementById('game_name').innerHTML = p.gameName;
            document.getElementById('btn_start').innerHTML = p.isHost ? 'Start game' : 'Ready';
            openMenu('mnu_players');
        }
    });
};

const handleOpenGames = function() {
    const p = this._private;
    const me = this;
    loading();
    p.isHost = false;

    function reloadGames(callback=null) {
        API.listGames(res=>{
            if (res) {
                p.games = res;
                refreshGames.call(me);
                if (callback)
                    callback();
                window.setTimeout(reloadGames,2000);
            }
            else {
                alert('failed to fetch games');
                openMenu('mnu_multiplayer');
            }
        });
    }
    reloadGames(()=>{
        openMenu('mnu_games');
    });
};

class Menu {
    constructor() {
        this._private = {
            isHost: false,
            gameName: '',
            gameID: '',
            password: '',
            games: [],
            players: [],
            hostGameCallback: null
        };
    }

    bind(playerID, hostGameCallback) {
        const p = this._private;
        const me = this;
        p.playerID = playerID;
        p.hostGameCallback = hostGameCallback;

        openMenu('mnu_player');

        // handle menu-closer clicks
        document.getElementById('all_containers').addEventListener('click',e=>{
            if (e.target.className == 'menu-closer' && e.target.getAttribute('rel')) {
                if (e.target.getAttribute('rel') == 'mnu_games')
                    handleOpenGames.call(me);
                else
                    openMenu(e.target.getAttribute('rel'));
            }
        },true);
        document.getElementById('btn_close_players').addEventListener('click',()=>{
            loading();
            API.disconnectFromGame(()=> {
                if (p.isHost)
                    openMenu('mnu_host');
                else
                    openMenu('mnu_games');
            }, p.playerID, p.gameID);
        });

        // handle player clicks
        document.getElementById('btn_multiplayer').addEventListener('click',()=>{
            p.playerName = document.getElementById('inp_playerName').value;
            if (!p.playerName.replace(/\s+/g,'')) {
                alert('Player name required');
                return;
            }
            openMenu('mnu_multiplayer');
        });

        // handle multiplayer clicks
        document.getElementById('btn_host').addEventListener('click',()=>{
            p.isHost = true;
            document.getElementById('inp_gameName').value = '';
            document.getElementById('inp_hostPassword').value = '';
            openMenu('mnu_host');
        });
        document.getElementById('btn_join').addEventListener('click',handleOpenGames.bind(me));
        
        // handle create game clicks
        document.getElementById('btn_create').addEventListener('click',handleCreateGame.bind(me));

        // handle join games clicks
        document.getElementById('lst_games').addEventListener('click',e=>{
            p.gameID = e.target.getAttribute('rel');
            p.password = '';
            if (p.games.filter(game=>{
                return game.gameID == p.gameID;
            })[0].hasPassword) {
                document.getElementById('inp_joinPassword').value = '';
                openMenu('mnu_password');
            }
            else
                joinGame.call(this);
        },true);

        // handle password join clicks
        document.getElementById('btn_authenticate').addEventListener('click',()=>{
            p.password = document.getElementById('inp_joinPassword').value;
            if (!p.password) {
                alert('password is required');
                return;
            }

            joinGame.call(this);
        });

        // handle game start click
        document.getElementById('btn_start').addEventListener('click',()=>{
            if (!p.isHost) {
                API.playerReady(p.gameID, p.playerID);
                document.querySelector(`#lst_players > [rel="${p.playerID}"]`).innerHTML = `${p.playerName} - ready`;
            }
            else
                API.startGame(res=>{
                    p.players = res;
                    closeMenus();
                    p.hostGameCallback();
                }, p.gameID, p.playerID);
        });
    }

    get isHost() {
        return this._private.isHost;
    }
    get gameName() {
        return this._private.gameName;
    }
    get gameID() {
        return this._private.gameID;
    }
    get playerName() {
        return this._private.playerName;
    }
    get players() {
        let ret = {};
        this._private.players.forEach(player=>{
            ret[player.playerID] = player.playerName;
        });
        return ret;
    }
}

export default new Menu();