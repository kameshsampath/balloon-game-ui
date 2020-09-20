import { Scene } from 'phaser';

class TitleScene extends Scene {


  constructor() {
    super('title');
  }

  create () {
    this.add.rectangle(0, 0,
      window.innerWidth,
      100,
      "#002A42")
      .setScale(2, 1);
    this.add.text(0, 0, "Balloon Mania", {
      fontFamily: "'RedHat Display'",
      fontSize: "32px",
      fill: "#ffffff"
    });
  }
}

export default TitleScene;