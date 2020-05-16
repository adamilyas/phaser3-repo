let Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu () {
        Phaser.Scene.call(this, 'menu');
    },

    create: function () {
        this.add.text(10, 10, 'Click anywhere for the TileMap demo.', { font: '16px Courier', fill: '#00ff00' });
        this.add.text(10, 40, 'Fill free to use this code as template for multiple scenes and tilemap.', { font: '16px Courier', fill: '#00ff00' });


        this.input.once('pointerup', function () {

            this.scene.start('game');

        }, this);

        this.events.on('shutdown', this.shutdown, this);
    },

    shutdown: function ()
    {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();
    }

});

let config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000', 
    pixelArt: true,
    parent: 'phaser-example',
    scene: [ Menu, Game ]
};

let game = new Phaser.Game(config);
