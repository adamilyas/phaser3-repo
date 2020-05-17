let Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu () {
        Phaser.Scene.call(this, 'menu');
    },

    create: function () {
        this.add.text(10, 10, 'Click anywhere to begin the game.', { font: '16px Courier', fill: '#00ff00' });

        this.input.once('pointerup', function () {

            this.scene.start('game', { id: 0, image: 'acryl-bladerunner.png' });

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
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000', 
    parent: 'phaser-example',
    scene: [ Menu, MazeGame ]
};

let game = new Phaser.Game(config);
