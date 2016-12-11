import Util from './../Util.js';

const ENDPOINT = '/api/';

const xhttp = new XMLHttpRequest();
const ajaxCall = (url,data={},callback=null)=>{
    let q = ['uid='+Util.uid(16)];
    for (let p in data)
        q.push(p+'='+data[p]);
    q = q.join('&');

    xhttp.onreadystatechange = function() {
        if (callback && this.readyState == 4) {
            if (this.status == 200)
                callback(JSON.parse(this.responseText));
            else
                callback(false);
        }
    };
    xhttp.open("GET", ENDPOINT+url+(q?('?'+q):''), true);
    xhttp.send();
};

export default class API {
    constructor() {
        throw new Error('API is a static class');
    }

    static newGame(callback, hostID, hostName, gameID, gameName, password='') {
        ajaxCall('newGame',{hostID, hostName, gameID, gameName, password},callback);
    }

    static listGames(callback) {
        ajaxCall('listGames',{},callback);
    }

    static joinGame(callback, playerID, playerName, gameID, password='') {
        ajaxCall('joinGame',{playerID, playerName, gameID, password},callback);
    }

    static disconnectFromGame(callback, playerID, gameID) {
        ajaxCall('disconnectFromGame',{playerID, gameID},callback);
    }

    static listPlayers(callback, gameID, playerID) {
        ajaxCall('listPlayers',{gameID, playerID},callback);
    }

    static playerReady(gameID, playerID) {
        ajaxCall('playerReady',{gameID, playerID});
    }

    static startGame(callback, gameID, playerID) {
        ajaxCall('startGame',{gameID, playerID},callback);
    }
}
