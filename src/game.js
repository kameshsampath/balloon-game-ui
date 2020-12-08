import Phaser, {AUTO, Game} from 'phaser';

import BackgroundScene from './scenes/BackgroundScene';
import GamePlayScene from './scenes/GamePlayScene';

const ping = {type: "heartbeat", msg: "ping"}
const register = {type: "register", msg: "register"}
let socket = new WebSocket("ws://localhost:8080/game");

let ballonGameConfig = {
  numberOfBalloons: 5,
  fireRate: 100,
  balloonRotationSpeed: 100,
  game: {},
  player: {}
};

let config = {
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'balloon-game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: -300},
      debug: false,
      checkCollision: {
        up: true,
        down: false,
        left: true,
        right: true
      }
    }
  },
  backgroundColor: '#efefef',
  type: AUTO
}

let game = new Game(config);
const backgroundScene = new BackgroundScene();
const playScene = new GamePlayScene(socket);
game.scene.add('background', backgroundScene, true,);
game.scene.add('play', playScene, false, ballonGameConfig);

// Connection opened
socket.addEventListener('open', function (event) {
  socket.send(JSON.stringify(register));
});

//Errors
socket.addEventListener('error', function (event) {
  console.log("Error connecting to server", event);
});

// Listen for messages
socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data);
  const gameMessage = JSON.parse(event.data);

  if (gameMessage) {
    if (gameMessage.type === "register") {
      const player = gameMessage.player
      console.log("Player %s", JSON.stringify(player))
      Object.assign(ballonGameConfig.player, player)
      Object.assign(ballonGameConfig.player, player)
    } else {
      const gm = gameMessage.game
      if (gm) {
        const gs = gm.state
        const player = ballonGameConfig.player
        const gameData = Object.assign(ballonGameConfig, gm.configuration,gm,player);
        switch (gs) {
          case "active":
          case "play":
          case "bonus": {
            if (!game.scene.isActive('play')) {
              game.scene.run('play', gameData);
            } else {
              playScene.setConfiguration(gameData);
            }
            break;
          }
          case "pause": {
            game.scene.pause('play', gameData);
            break;
          }
          case "stop":
          case "lobby": {
            game.scene.stop('play');
            break;
          }
          case "heartbeat": {
            socket.send(JSON.stringify(ping));
            break;
          }
          default: {
            console.log("no action");
          }
        }
      }
    }
  }
});
