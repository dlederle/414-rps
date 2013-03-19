var puts = require("util").puts,
    net  = require("net"),
    playerCount = 0,  //Yay globals
    players = [],
    moves = 0;

var server = net.createServer(function (socket) {
  playerCount++;
  if(playerCount < 4) {
    socket.write("Welcome to RPS. What is your username? Please use the format username:myUsername\n", function() {
      socket.on('data', function(data) { handleInput(data, socket); });
    }); 
  } else {
    socket.end("Sorry, game is full\n");
  }
});

var handleInput = function(data, sock) {
  if(/^\s+$/.test(data.toString())) { puts("whitespace"); return; }
  var input = { 
    "full": data.toString(), 
    "key": data.toString().split(":")[0].trim(),
    "value": data.toString().split(":")[1].trim()
  }
  switch(input["key"]) {
    case "username":
      addPlayer(input["value"], sock);  
      break;
    case "move":
      if(input["value"] == "rock" || input["value"] == "scissors" || input["value"] == "paper") {
        makeMove(input["value"], sock);
      } else {
        sock.write("Please choose 'rock', 'paper', or 'scissors'\n");
      }
      break;
    case "quit":
      players.forEach(function(i, e, a) {
        if(e.socket == sock) {
          delete players[i];
        }
      });
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
  scores = { 
      "rock" :     { count: 0, pts: 0, socks: [] }, 
      "paper" :    { count: 0, pts: 0, socks: [] }, 
      "scissors" : { count: 0, pts: 0, socks: [] }
  }

  players.forEach(function(el, i, arr) {
    scores[el.move]["count"]++;
  });

  if(scores["rock"]["count"] == 2) {
    if(scores["paper"]["count"] == 1) {
      scores["paper"]["pts"] += 2;
    } else {
      scores["rock"]["pts"] += 1;
    }
  } else if(scores["paper"]["count"] == 2) {
    if(scores["scissors"]["count"] == 1) {
      scores["scissors"]["pts"] += 2;
    } else {
      scores["paper"]["pts"] += 1;
    }
  } else if(scores["scissors"]["count"] == 2) {
    if(scores["rock"]["count"] == 1) {
      scores["rock"]["pts"] += 2;
    } else {
      scores["scissors"]["pts"] += 1;
    }
  }
  //I don't even want to think about the runtime efficiency of this
  players.forEach(function(el, ind, arr) {
    Object.keys(scores).forEach(function(e, i, a) {
      if(scores[e].socks.indexOf(el["socket"])) {
        el.score += scores[e].pts;
        el.ptsGained = scores[e].pts;
      }
    });
  });

  printScores();
}

var printScores = function() {
  var msg = "Round over:";
  players.forEach(function(el, i, arr) {
    msg += el.username + " chose " + el.move + " and gained " + el.ptsGained + ". ";
    msg += "They now have " + el.score + " total points. ";
  });
  players.forEach(function(e, i, a) {
    e.socket.write(msg);
  });
}

var startGame = function() {
  moves = 0;
  players.forEach(function(el, i, arr) {
    el["socket"].write("Please choose your move. " +
                    "Answer in the form move:[rock, paper, scissors]\n");
  });
}

process.addListener("SIGINT", function() {
  puts("goodbye");
  process.exit(0);
});
server.listen(1337, '127.0.0.1');
