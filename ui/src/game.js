import Phaser,{AUTO,Game} from 'phaser';

import BackgroundScene from './scenes/BackgroundScene';
import GamePlayScene from './scenes/GamePlayScene';

let ballonGameConfig={
  numberOfBalloons: 5,
  fireRate: 100,
  balloonRotationSpeed: 100
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
      gravity: { y: -300 },
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
const playScene = new GamePlayScene();
game.scene.add('background', backgroundScene, true,);
game.scene.add('play', playScene, false, ballonGameConfig);

//TODO move to seperate file

const ping = { type: "ping", msg: "hello" }
let socket = new WebSocket("ws://localhost:8083/socket");

// Connection opened
socket.addEventListener('open', function (event) {
  //TODO Keep sending requests to keep connection open
  socket.send(JSON.stringify(ping));
});

//Errors
socket.addEventListener('error', function (event) {
  console.log("Error connecting to server", event);
});

// Listen for messages
socket.addEventListener('message', function (event) {
  //console.log('Message from server ', event.data);
  const gameMessage = JSON.parse(event.data);

  if (gameMessage && gameMessage.game) {
    const gm = gameMessage.game
    const gs = gm.state;
    const gameData = Object.assign(ballonGameConfig, gm.configuration);
    switch (gs) {
      case "active":
      case "bonus": {
        if (!game.scene.isActive('play')) {
          game.scene.run('play', gameData);
        } else {
          playScene.setConfiguration(gameData);
        }
        break;
      }
      case "paused": {
        game.scene.pause('play', gameData);
        break;
      }
      case "stopped":
      case "lobby": {
        game.scene.stop('play');
        break;
      }
      default: {
        console.log("no action");
      }
    }
  }
});
