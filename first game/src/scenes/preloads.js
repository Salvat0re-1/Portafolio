// Clase Preloads, para separar los preloads y tener mejor orden
export class Preloads extends Phaser.Scene {
    // Se extiende de Phaser.Scene porque es una escena
    constructor() {
      // Se asigna una key para despues poder llamar a la escena
      super("Preloads");
    }
  
    preload() {
      this.load.image("sad_cow", "../first game/assets/sad_cow.png");
      this.load.image("phaser_logo", "../first game/assets/phaser_logo.png");
      this.load.image(
        "mainmenu_bg",
        "../first game/assets/main_menu_background.png"
      );
      this.load.image("sky", "../first game/assets/sky.png");
      this.load.image("ground", "../first game/assets/platform.png");
      this.load.image("orange", "../first game/assets/platform 2.png");
      this.load.image("star", "../first game/assets/star.png");
      this.load.image("gem", "../first game/assets/gema.png");
      this.load.image("bomb", "../first game/assets/bomb.png");
  
      this.load.spritesheet("dude", "../first game/assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
    }
  
    create() {
      //  Our player animations, turning, walking left and walking right.
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20,
      });
  
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });
  
      // Pasa directamente a la escena del menú principal
      this.scene.start("MainMenu");
    }
}