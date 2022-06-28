// Clase Preloads, para separar los preloads y tener mejor orden
export class Preloads extends Phaser.Scene {
  // Se extiende de Phaser.Scene porque es una escena
  constructor() {
    // Se asigna una key para despues poder llamar a la escena
    super("Preloads");
  }

  preload() {
    this.load.image("sad_cow", "public/assets/imagines/sad_cow.jpg");
    this.load.image("phaser_logo", "public/assets/imagines/phaser_logo.png");
    this.load.image(
      "mainmenu_bg",
      "public/assets/imagines/main_menu_background.png" 
    );
    this.load.image("star", "public/assets/imagines/star.png");
    this.load.image("point", "public/assets/imagines/point.png");
    this.load.image("bomb", "public/assets/imagines/bomb.png");
    this.load.spritesheet("dude", "public/assets/imagines/dude.png", {
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