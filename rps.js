var puts = require("util").puts,
    net  = require("net"),
    playerCount = 0,  //Yay globals
    players = [],
    scores = [],
    moves = 0;

var server = net.createServer(function (socket) {
  playerCount++;
  if(playerCount < 4) {
    socket.write("Welcome to RPS. What is your username?\nPlease use the format username:myUsername\n", function() {
      socket.on('data', function(data) { handleInput(data, socket); });
    }); 
  } else {
    socket.end("Sorry, game is full\n");
  }
});

var handleInput = function(data, sock) {
  var input = { 
    "full": data.toString(), 
    "key": data.toString().split(":")[0],
    "value": data.toString().split(":")[1]
  }
  switch(input["key"]) {
    case "username":
      addPlayer(input["value"], sock);  
      break;
    case "move":
      makeMove(input["value"], sock);
      break;
    default: 
      sock.write("Sorry, I don't understand. Please format input correctly\n");
  }
}

var addPlayer = function(name, sock) {
  var taken = false;
  name = name.trim()
  players.forEach(function(el, i, arr) {
    if(el.username == name) {
      sock.write("Username taken, please choose another\n");
      taken = true;
    }
  });

  if(!taken) {
    players.push({ 
      username: name,
      score: 0,
      socket: sock,
      move: false
    });

    if(players.length === 3) {
      startGame();
    } else {
      sock.write("Welcome " + name + ", please wait for the game to begin.\n");
    }

  }
}

var makeMove = function(move, sock) {
  players.forEach(function(el, i, arr) {
    if(sock === el["socket"]) {
      el["move"] = move;
      moves++;
      sock.write("Please wait for all moves to finish\n");
    }
  });

  if(moves === 3) {
    calcWinner();
  }
}

var calcWinner = function() {
  mvs = [];
  players.forEach(function(el, i, arr) {
    
  }
}

var startGame = function() {
  moves = 0;
  players.forEach(function(el, i, arr) {
    el["socket"].write("Please choose your move.\n" +
                    "Answer in the form move:[rock, paper, scissors]\n");
  });
}

process.addListener("SIGINT", function() {
  puts("goodbye");
  process.exit(0);
});

server.listen(1337, '127.0.0.1');
