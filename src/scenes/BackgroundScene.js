import { Scene } from 'phaser';

class BackgroundScene extends Scene {

  constructor() {
    super('background');
  }

  init () {
    this.cameras.main
      .setBackgroundColor('#7bb2f2')
      .setTintFill();
  }

  preload () {
    this.load
      .image('clouds', 'assets/clouds.png');
    this.load.svg('appLogo',
      'assets/enterprise-splash-platform.svg',
      { width: 300, height: 300 });
  }
  create () {
    this.add.image(this.cameras.main.centerX,
      this.cameras.main.centerY,
      'clouds')
      .setScale(2.2, 2.2);
    this.add
      .image(this.cameras.main.centerX,
        this.cameras.main.centerY,
        'appLogo')
      .setAlpha(0.6);
  }
}

export default BackgroundScene;