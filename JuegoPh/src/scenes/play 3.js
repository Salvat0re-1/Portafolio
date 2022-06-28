// Declaracion de variables para esta escena
var player;
var stars;
var bombs;
var cursors;
var score;
var gameOver;
var scoreText;
var points;
var scoreTime;
var scoreTimeText;
var timedEvent;

// Clase Play, donde se crean todos los sprites, el escenario del juego y se inicializa y actualiza toda la logica del juego.
export class Play3 extends Phaser.Scene {
  constructor() {
    // Se asigna una key para despues poder llamar a la escena
    super("Play3");
  }

  init(data) {
    // recupera el valor SCORE enviado como dato al inicio de la escena
    score = data.score;
    scoreTime = data.scoreTime;

    console.log(score);

  }

  preload() {
    this.load.tilemapTiledJSON("map3", "public/assets/tilemaps/map3.json");
    this.load.image("tilesBelow3", "public/assets/imagines/sky_atlas.png");
    this.load.image("tilesPlatform3", "public/assets/imagines/platform_atlas.png");
  }
  
  onSecond() {
    if (! gameOver)
    {
        scoreTime = scoreTime - 1; // One second
        scoreTimeText.setText('Time: ' + scoreTime);
        if (scoreTime == 0) {
            timedEvent.paused = true;
            this.scene.start(
              "Retry",
              { score: score } // se pasa el puntaje como dato a la escena RETRY
            );
        }
    }
  }


  create() {

    timedEvent = this.time.addEvent({ 
      delay: 1000, 
      callback: this.onSecond, 
      callbackScope: this, 
      loop: true 
    });


    const map3 = this.make.tilemap({ key: "map3" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tilesetBelow3 = map3.addTilesetImage("sky_atlas", "tilesBelow3");
    const tilesetPlatform3 = map3.addTilesetImage(
      "platform_atlas",
      "tilesPlatform3"
    );

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map3.createLayer("Fondo", tilesetBelow3, 0, 0);
    const worldLayer = map3.createLayer("Plataformas", tilesetPlatform3, 0, 0);
    const objectsLayer = map3.getObjectLayer("Objetos");

    worldLayer.setCollisionByProperty({ collides: true });

    // tiles marked as colliding
    /*
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    worldLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
    */

    // Find in the Object Layer, the name "dude" and get position
    const spawnPoint = map3.findObject("Objetos", (obj) => obj.name === "dude");
    // The player and its settings
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Input Events
    if ((cursors = !undefined)) {
      cursors = this.input.keyboard.createCursorKeys();
    }

    // Create empty group of starts
    stars = this.physics.add.group();
    points = this.physics.add.group();
    bombs = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectsLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name, type } = objData;
      switch (name) {
        case "star": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          var star = stars.create(x, y, "star");
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
        case "point": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          var point = points.create(x, y, "point");
          point.setBounceY(Phaser.Math.FloatBetween(0.3, 0.5));
          break;
        }
       
      }


    });



    // Create empty group of bombs
    bombs = this.physics.add.group();

    objectsLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name, type } = objData;
      switch (name) {
        case "bomb": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          var bomb = bombs.create(x, y, "bomb");
          bomb.setBounceY(Phaser.Math.FloatBetween(1,5, 1,5));
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          break;
         
        }
      }


    });

    //  The score
    scoreText = this.add.text(30, 6, "Score: " + score, {
      fontSize: "32px",
      fill: "white",
    });

    scoreTimeText = this.add.text(650, 6, "Time: " + scoreTime,{
      fontSize: "32px",
      fill: "#FFFFFF",
    });

    

    // Collide the player and the stars with the platforms
    // REPLACE Add collision with worldLayer
    this.physics.add.collider(player, worldLayer);
    this.physics.add.collider(stars, worldLayer);
    this.physics.add.collider(points, worldLayer);
    this.physics.add.collider(bombs, worldLayer);
  
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, this.collectStar, null, this);
    this.physics.add.overlap(player, points, this.collectPoint, null, this);
    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    gameOver = false;
    
  }

  update() {
    if (gameOver) {
      return;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    // REPLACE player.body.touching.down
    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-330);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0 && points.countActive(true) === 0) {
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, child.y + 10, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }
  
  collectPoint(player, point) {
    point.disableBody(true, true);

    //  Add and update the score
    score += 15;
    scoreText.setText("Score: " + score);

    if (points.countActive(true) === 0 && stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      points.children.iterate(function (child) {
        child.enableBody(true, child.x, child.y + 10, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    gameOver = true;

    // Función timeout usada para llamar la instrucción que tiene adentro despues de X milisegundos
    setTimeout(() => {
      // Instrucción que sera llamada despues del segundo
      this.scene.start(
        "Retry",
        { score: score } // se pasa el puntaje como dato a la escena RETRY
      );
    }, 1000); // Ese número es la cantidad de milisegundos
  }
}