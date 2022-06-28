var player;
var stars;
var bombs;
var gems;
var platforms;
var cursors;
var score;
var gameOver;
var keyR;
var scoreText;
var scoreTime;
var scoreTimeText;
var timedEvent

// Clase Play, donde se crean todos los sprites, el escenario del juego y se inicializa y actualiza toda la logica del juego.
export class Play extends Phaser.Scene {
    constructor() {
      // Se asigna una key para despues poder llamar a la escena
      super("Play");
    }

init(data) {
    // recupera el valor SCORE enviado como dato al inicio de la escena
    score = data.score;
    scoreTime = data.scoreTime;
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

    
    gameOver=false

    timedEvent = this.time.addEvent({ 
        delay: 1000, 
        callback: this.onSecond, 
        callbackScope: this, 
        loop: true 
    });

    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'orange');
    platforms.create(50, 250, 'orange');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    keyR= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 5,
        setXY: { x: 10, y: 0, stepX: 150 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    gems = this.physics.add.group({
        key: 'gem',
        repeat: 4,
        setXY: { x: 80, y: 0, stepX: 150 }
    });

    gems.children.iterate(function (child) {

        //  Give each gem a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'Score: 0', { stroke: 'white', strokeThickness: 5, fontSize: '48px Arial', fill: 'black' });

    scoreTimeText = this.add.text(600, 16, "Time: " + scoreTime, {
        fontSize: "48px Arial",
        fill: "white",
        stroke: 'black',
        strokeThickness: 5,
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(gems, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, this.collectStar, null, this);
    this.physics.add.overlap(player, gems, this.collectGem, null, this);
    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

}

      
update ()
{
    console.log(keyR.isDown)

    if (gameOver)
    {
        if (keyR.isDown)
        {
            this.scene.start();
        }
    }

    if (keyR.isDown)
        {
            this.scene.start();
        }


    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

collectStar (player, star) 
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0 && gems.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        gems.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

collectGem (player, gem) 
{
    gem.disableBody(true, true);

   
    score += 15;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0 && gems.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        gems.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

hitBomb (player, bomb) 
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    // Función timeout usada para llamar la instrucción que tiene adentro despues de X milisegundos
    setTimeout(() => {
        // Instrucción que sera llamada despues del segundo
        this.scene.start(
            "Retry",
            { score: score } // se pasa el puntaje como dato a la escena RETRY
        );
        }, 1000); // Ese número es la cantidad de milisegundos }

    }
}