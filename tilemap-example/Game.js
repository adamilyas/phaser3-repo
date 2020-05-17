// Constants
const unit = 32;

// Variables
let player;
let layer;
let speedDelay = 75;

// Game
var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Demo () {
        Phaser.Scene.call(this, { key: 'game' });
    },

    preload: function () {
        this.load.image('tiles', [ 'assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png' ]);
        this.load.image('smile', 'assets/sprites/smile.png');

    },

    create: function (){



        let tileMapArray = [
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
            [2,0,0,0,1,0,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
            [2,0,0,1,0,0,0,0,0,0,1,0,0,2],
            [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2],

        ];
        let map = this.make.tilemap({
            data: tileMapArray, 
            tileWidth: 32,
            tileHeight: 32
        });
        let tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);

        layer = map.createDynamicLayer(0, tileset, 0, 0);
        
        this.add.text(10, 390, 'Press arrow keys to move!', { font: '16px Courier', fill: '#00ff00' });

        let backToMenuText = this.add.text(10, 350, 'Click here to return back to menu', { font: '16px Courier', fill: '#00ff00' });
        backToMenuText.setInteractive(new Phaser.Geom.Rectangle(0, 0, backToMenuText.width, backToMenuText.height), Phaser.Geom.Rectangle.Contains);        
        backToMenuText.once('pointerup', function () {
            console.log('Click Instructions');
            this.scene.start('menu');
        }, this)

        player = this.add.image(unit * 1.5, unit * 1.5, 'smile').setScale(0.45);

        cursors = this.input.keyboard.createCursorKeys();        
    },



    // Controls
    update: function(){
    
        if (this.input.keyboard.checkDown(cursors.left, speedDelay)){
            let tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);
            
            if (tile.index === 0){
                player.x -= 32;
            }
        }
        else if (this.input.keyboard.checkDown(cursors.right, speedDelay)) {
            let tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);
    
            if (tile.index === 0){
                player.x += 32;
            }
        }
        else if (this.input.keyboard.checkDown(cursors.up, speedDelay)) {
            let tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);
    
            if (tile.index === 0){
                player.y -= 32;
            }
        } else if (this.input.keyboard.checkDown(cursors.down, speedDelay)) {
            let tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);
    
            if (tile.index === 0){
                player.y += 32;
            }
        }
    }

});