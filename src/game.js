import Phaser,{AUTO,Game} from 'phaser';
import BackgroundScene from './scenes/BackgroundScene';
import GamePlayScene from './scenes/GamePlayScene';

let ballonGameConfig={
  numberOfBalloons: 5,
  fireRate: 100,
  balloonRotationSpeed: 100,
  speed: 70,
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
let playScene = new GamePlayScene();
game.scene.add('background', BackgroundScene, true,);
game.scene.add('play', playScene, true, ballonGameConfig);