//create new scene
let gameScene = new Phaser.Scene('Game');

//used for paramaters such as speed and dmg
gameScene.init = function() {
    //player speed
    this.heroSpeed = 3.5;
    
    //enemy speed
    this.enemyMinSpeed = .5;
    this.enemyMaxSpeed = 4.5;

    //boundaries
    this.enemyMinY = 80;
    this.enemyMaxY = 280;

    //game over checker
    this.isTerminating = false;
}
//load assets
gameScene.preload = function() {
    //load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('dragon', 'assets/dragon.png');
    this.load.image('treasure', 'assets/treasure.png');
}

//call once after preload
gameScene.create = function() {
    let gameWidth = this.sys.game.config.width;
    let gameHeight = this.sys.game.config.height;

    //create sprites; make sure they're layered bottom-top
    let bg = this.add.sprite(gameWidth/2, gameHeight/2, 'background');
    this.hero = this.add.sprite(20, gameHeight/2, 'player');
    //this.enemy = this.add.sprite(150, gameHeight/2, 'dragon');
    this.goal = this.add.sprite(gameWidth - 80, gameHeight/2, 'treasure');

    //adding enemies 
    this.enemies = this.add.group();
    this.enemies = this.add.group({
        key: 'dragon',
        repeat:5,
        setXY: {
            x: 90,
            y:100,
            stepX: 80,
            stepY:20
        }
    });

    //enemy transforming
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
        //flip
        enemy.flipX = true;

        //scale
        enemy.setScale(.5);

        //speed
        let dir = Math.random() < .5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = dir * speed;

    }, this);

    //other transforming
    this.hero.setScale(.4,.5);
    this.goal.setScale(.60);
};

//called up to 60 times a second
gameScene.update = function() {

    //if we are terminating, do not execute
    if(this.isTerminating) {
        return;    
    }

    let heroRect = this.hero.getBounds();
    let goalRect = this.goal.getBounds();

    //calling enemy group
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    //enemy behaviors
    for(let i = 0; i < numEnemies; i++) {
        enemies[i].y += enemies[i].speed;

        //check we are moving within boundaries 
        let tooHigh = (enemies[i].speed < 0) && (enemies[i].y <= this.enemyMinY);
        let tooLow = (enemies[i].speed > 0) && (enemies[i].y >= this.enemyMaxY);

        if(tooHigh || tooLow) {
            enemies[i].speed *= -1;

        }

        //enemy boundaries
        let enemyRect = enemies[i].getBounds();

        if(Phaser.Geom.Intersects.RectangleToRectangle(heroRect, enemyRect)) {
            return this.gameOver();
        }
    }
    
    //check for input from user ((also looks for touch events))
    if(this.input.activePointer.isDown) {
        //hero walks
        this.hero.x += this.heroSpeed;
    }

    //check to see if player hits the goal
    if(Phaser.Geom.Intersects.RectangleToRectangle(heroRect, goalRect)) {
    return this.gameOver();

    }

}

gameScene.gameOver = function() {

    //checks for game over sequence
    this.isTerminating = true;
    //shake camera
    this.cameras.main.shake(400);

    //listen for event completion
    this.cameras.main.on('camerashakecomplete', function(){
        //fade to black
        this.cameras.main.fade(250);

    }, this);

    this.cameras.main.on('camerafadeoutcomplete', function() {
        this.scene.restart();

    }, this);

}



//set config
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
};

//create new game; pass config
let game = new Phaser.Game(config);




                            /*N O T E S  
                                B E L O W 
                                    T H I S
                                        L I N E*/
//PHASER NOTES
    // phaser coordinates are X,Y
    // start in top left
    // down is y, up is -y
    // right is x, left is -x


    // phaser scaling asks for multiples in param
    // .setScale(2) would be twice the size
    // .setScale(.5) would be half the size
    // .setScale(0.5,2) would be half of x, and double y
    // also: .flipX, .flipY, .scaleX, .scaleY


    // 60fps is the goal of phaser




//CREATE NOTES
    //additional methods
   /* enemy.setScale(3);
    enemy.flipX = true;
    //rotating
    enemy.angle = -45;
    enemy.setAngle(45);
    enemy.rotation = Math.PI / 4;
    enemy.setRotation(Math.PI / 4);*/
    //controlling depth - higher the num, further from bottom
    //player.depth = 1;
    //changing origin to top left corner
    //bg.setOrigin(0,0);
    //setting position
    //bg.setPosition(gameWidth/2,gameHeight/2);
    //player.x = 10; //etc etc




//UPDATE NOTES
    //to move, increase the x or y value
    //this.enemy.x += 1;

    //will rotate in increments of 1
    //this.enemy.angle += 1;