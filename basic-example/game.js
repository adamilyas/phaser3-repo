var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var ship;
var smile;
var speed;
var cursors;
var text;

// window.onload = function(){
//     var game = new Phaser.Game(config);
// }

var game = new Phaser.Game(config);

function preload(){
    this.load.image('ship', 'assets/sprites/ship.png');
    this.load.image('smile', 'assets/sprites/smile.png');
}

function create(){
    // ship = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' });
    //ship = this.add.sprite(400, 500, 'ship');

    ship = this.add.sprite(400, 500, 'smile');
    cursors = this.input.keyboard.createCursorKeys();
    speed = Phaser.Math.GetSpeed(300, 1);
}

// Control the movement
function update(time, delta){

    if (cursors.left.isDown){
        ship.x -= speed * 2 * delta;
    } 
    else if (cursors.right.isDown){
        ship.x += speed * 2 * delta;
    }
    else if (cursors.up.isDown){
        ship.y -= speed * 2 * delta;
    }
    else if (cursors.down.isDown){
        ship.y += speed * 2 * delta;
    }    
}
