var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');
var proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true
});
var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));

var games = [];

setInterval(function(){
  games = games.filter(game=>{
    return game.created > (new Date()).getTime() - 3600000;
  });
},1000);

setInterval(function(){
  let time = (new Date()).getTime();
  games = games.filter(game=>{
    let hostDied = false;
    game.players = game.players.filter(player=>{
      player.lastPing = player.lastPing || time;
      let res = player.lastPing > time - 5000;
      if (!res && game.hostID == player.playerID)
          hostDied = true;
      return res;
    });
    return !hostDied;
  });
},1000);

app.all('/api/newGame', function (req, res) {
  games.push({
    created:(new Date()).getTime(),
    started:false,
    hostID:req.query.hostID,
    hostName:req.query.hostName,
    players:[{playerID:req.query.hostID,playerName:req.query.hostName,isReady:false}],
    gameID:req.query.gameID,
    gameName:req.query.gameName,
    password:req.query.password
  });
  res.send('true');
});

app.all('/api/listGames', function (req, res) {
  res.send(JSON.stringify(games.filter(game=> {
    return !game.started;
  }).map(game=>{
    return {
      gameName:game.gameName,
      gameID:game.gameID,
      hostName:game.hostName,
      players:game.players.map(player=>{
        return {playerName:player.playerName,isReady:player.isReady}
      }),
      hasPassword:!!game.password
    };
  })));
});

app.all('/api/listPlayers', function (req, res) {
  let game = games.filter(game=>{
    return game.gameID == req.query.gameID;
  });
  game = game.length?game[0]:null;

  if (!game) {
    res.send('false');
    return;
  }

  let player = game.players.filter(player=>{
    return player.playerID == req.query.playerID;
  });
  if (!player.length) {
    res.send('false');
    return;
  }
  player = player[0];
  player.lastPing = (new Date().getTime());

  res.send(JSON.stringify(game.players.map(player=>{
    return {playerName:player.playerName,isReady:player.isReady,playerID:player.playerID==req.query.playerID?player.playerID:''};
  })));
});

app.all('/api/playerReady', function (req, res) {
  let game = games.filter(game=>{
    return game.gameID == req.query.gameID;
  });
  game = game.length?game[0]:null;

  if (!game) {
    res.send('false');
    return;
  }

  if (!game.players.filter(player=>{
        let found = player.playerID == req.query.playerID;
        if (found)
            player.isReady = true;
        return found;
      }).length) {
    res.send('false');
    return;
  }

  res.send('true');
});

app.all('/api/startGame', function (req, res) {
  let game = games.filter(game=>{
    return game.gameID == req.query.gameID;
  });
  game = game.length?game[0]:null;
  game.started = true;

  if (!game) {
    res.send('false');
    return;
  }

  let host = null;
  if (!game.players.filter(player=>{
        let found = player.playerID == req.query.playerID;
        if (found) {
          if (player.playerID == game.hostID)
              host = player;
          player.isReady = true;
        }
        return found;
      }).length) {
    res.send('false');
    return;
  }

  if (!host) {
    res.send('false');
    return;
  }

  res.send(JSON.stringify(game.players));
});

app.all('/api/disconnectFromGame', function (req, res) {
  games = games.filter(game=>{
    return game.hostID != req.query.playerID;
  });
  let game = games.filter(game=>{
    return game.gameID == req.query.gameID && !game.started;
  });
  game = game.length?game[0]:null;

  if (game) {
    game.players = game.players.filter(player=>{
      return player.playerID != req.query.playerID;
    });
  }
});

app.all('/api/joinGame', function (req, res) {
  let game = games.filter(game=>{
    return game.gameID == req.query.gameID && !game.started;
  });
  game = game.length?game[0]:null;

  if (!game) {
    res.send('false');
    return;
  }

  if (game.password != req.query.password) {
    res.send('"password"');
    return;
  }

  game.players.push({playerID:req.query.playerID,playerName:req.query.playerName,isReady:false});
  res.send(`"${game.gameName}"`);
});

if (!isProduction) {

  var bundle = require('./server/bundle.js');
  bundle();
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://127.0.0.1:3001'
    });
  });
  app.all('/socket.io*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://127.0.0.1:3001'
    });
  });


  proxy.on('error', function(e) {
    // Just catch it
  });

  // We need to use basic HTTP service to proxy
  // websocket requests from webpack
  var server = http.createServer(app);

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  server.listen(port, function () {
    console.log('Server running on port ' + port);
  });

} else {

  // And run the server
  app.listen(port, function () {
    console.log('Server running on port ' + port);
  });

}
