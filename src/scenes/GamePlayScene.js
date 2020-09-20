import Phaser, { Scene } from 'phaser';

class GamePlayScene extends Scene {

  constructor() {
    super("play")
    this.nextFire = 0;
    this.consecutive = 0;
  }

  preload () {

    this.load.image('titlebar', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');

    this.balloonsAtlas = this.load.atlas('balloons',
      'assets/balloons_v2.png',
      'assets/balloons_v2.json');

    //console.log(this.balloonsAtlas)

    this.load.spritesheet({
      key: 'explosion_default',
      url: 'assets/explosion.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
        endFrame: 10
      }
    });

    this.load.spritesheet({
      key: 'explosion_green',
      url: 'assets/explosion_green.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
        endFrame: 10
      }
    });

    this.load.spritesheet({
      key: 'explosion_red',
      url: 'assets/explosion_red.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
        endFrame: 10
      }
    });

    this.load.spritesheet({
      key: 'explosion_blue',
      url: 'assets/explosion_blue.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
        endFrame: 10
      }
    });

    this.load.spritesheet({
      key: 'explosion_yellow',
      url: 'assets/explosion_yellow.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
        endFrame: 10
      }
    });
  }

  init (data) {
    //console.log("Game Config", data);
    this.configuration = data;
  }

  create () {

    //Title 
    this.titleBar = this.physics.add.staticGroup()

    //TODO fix this well
    this.titleBar
      .create(0, 0, 'titlebar', true, true)
      .setScale(20, 3)
      .refreshBody();

    this.add.text(0, 0, "Balloon Mania", {
      fontFamily: "'RedHat Display'",
      fontSize: "32px",
      fill: "#ffffff"
    });

    this.scoreText = this.add.text(16, 75, "Score:0", {
      fontFamily: "'JetBrains Mono'",
      fontSize: "28px",
      fill: "#000"
    });

    //console.log("Play Data ", JSON.stringify(this.this.configuration.numberOfBalloons));
    //Create balloons group
    this.balloons = this.physics.add.group();

    const frameNames = ['balloon_red', 'balloon_green', 'balloon_blue', 'balloon_yellow', 'balloon_golden1', 'balloon_golden2']

    for (var i = 0; i < this.configuration.numberOfBalloons; i++) {
      this.balloons.create(0, 0, 'balloons',
        frameNames[i - 1], false, false);
    }

    //ConfigureBalloon
    Phaser.Actions.Call(this.balloons.getChildren(),
      this.setupBalloon);

    //Register outof bounds event
    this.physics.world.on('worldbounds', (body, blockedUp,
      blockedDown, blockedLeft, blockedRight) => {
      this.burstBaloon(body.gameObject,
        body.center.x,
        body.center.y);
      console.log("Blocked up:%s Blocked Down:%s", blockedUp, blockedDown);
    }, this);

    this.createExplosions();
    this.throwNewBalloon();
  }

  update (time, delta) {
    if (time > this.nextFire) {
      this.nextFire = this.configuration.fireRate + time + delta;
      //console.log("Time=%f,Delta=%f,nextFire=%f", time, delta, this.nextFire)
      if (this.balloons.countActive(false) > 0) {
        this.throwNewBalloon();
      }
    }
  }

  createExplosions = () => {
    this.anims.create({
      key: 'explode_default',
      frames: this.anims.generateFrameNumbers('explosion_default', {
        start: 0,
        end: 10
      }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'explode_red',
      frames: this.anims.generateFrameNumbers('explosion_red', {
        start: 0,
        end: 10
      }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'explode_green',
      frames: this.anims.generateFrameNumbers('explosion_green', {
        start: 0,
        end: 10
      }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'explode_blue',
      frames: this.anims.generateFrameNumbers('explosion_blue', {
        start: 0,
        end: 10
      }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'explode_yellow',
      frames: this.anims.generateFrameNumbers('explosion_yellow', {
        start: 0,
        end: 10
      }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });
    this.explosions = this.physics.add.group();
    this.explosions.createMultiple(16, 'explosions');
    this.explosions.getChildren().forEach(e => {
      e.anims.add('explode_red');
      e.anims.add('explode_green');
      e.anims.add('explode_blue');
      e.anims.add('explode_yellow');
    })
  }

  setupBalloon = (balloon) => {
    balloon.body.enable = true;
    //Register event for touch 
    balloon.setInteractive()
      .on('pointerdown', (pointer, x, y, event) => {
        this.burstBaloon(balloon,
          pointer.x,
          pointer.y);
        this.consecutive++;
      })
    //When colloding with titlebar, burst the balloon
    this.physics.add
      .overlap(this.titleBar, this.balloons, (t, b) => {
        this.burstBaloon(b,
          b.body.position.x + b.width / 2,
          b.body.position.y + b.height / 2);
        this.consecutive = 0
      }, null, this);
  }

  throwNewBalloon = () => {

    let balloon;

    //GoldenSnitch 1
    if (this.configuration.goldenSnitch &&
      Math.random() < this.goldenSnitchChance
      && !this.goldenSnitch1Created) {
      balloon = this.balloons
        .create(0, 0,
          'balloons',
          4, false, false);
      this.goldenSnitch1Created = true;
      this.setupBalloon(balloon);
    } //GoldenSnitch 2
    else if (this.configuration.goldenSnitch2 &&
      Math.random() < this.goldenSnitchChance
      && !this.goldenSnitch2Created) {
      balloon = this.balloons
        .create(0, 0,
          'balloons',
          5, false, false);
      this.goldenSnitch2Created = true;
      this.setupBalloon(balloon);
    } else {
      balloon = this.balloons.getFirstDead();
    }

    //console.log("Throwing new Balloon %s", JSON.stringify(balloon));

    let x = this.physics.world.bounds.centerX
      + Phaser.Math.RND.integerInRange(-200, 200);
    let y = this.physics.world.bounds.height;
    //console.log("X=%d and Y=%d", x, y)

    //Set angular velocity
    balloon.body.angularVelocity = (Math.random() - 0.5) * this.configuration.balloonRotationSpeed;

    //set the balloon coordinates
    balloon.setPosition(x, y);

    //move it 
    let moveX = this.physics.world.bounds.centerX
      + Phaser.Math.RND.integerInRange(-100, 100);
    let moveY = this.physics.world.bounds.centerY;
    const speed = (this.physics.world.bounds.height + 56 - 568) * 0.5
      + (575 + (this.configuration.speed - 50) * 5);
    //const speed = 1;//this.configuration.speed;

    //console.log("moveX=%d, moveY=%d, speed=%d", moveX, moveY, speed)
    balloon.visible = true;
    balloon.active = true;
    this.physics.moveTo(balloon, moveX, moveY, speed);
  }

  updateScore = () => {
    this.scoreText(`Score:${this.consecutive}`)
  }

  burstBaloon = (balloon, explosionX, explosionY) => {
    //console.log("Balloon %s", balloon.frame.name);
    let frameName = balloon.frame.name;
    var explosion = this.explosions
      .get()
      .setActive(true);
    explosion.x = explosionX;
    explosion.y = explosionY;
    switch (frameName) {
      case 'balloon_red': {
        explosion.play('explode_red');
        break;
      }
      case 'balloon_green': {
        explosion.play('explode_green');
        break;
      }
      case 'balloon_blue': {
        explosion.play('explode_blue');
        break;
      }
      case 'balloon_yellow': {
        explosion.play('explode_yellow');
        break;
      }
      default: {
        explosion.play('explode_default');
        break;
      }
    }

    this.balloons.killAndHide(balloon);
  }
}

export default GamePlayScene;