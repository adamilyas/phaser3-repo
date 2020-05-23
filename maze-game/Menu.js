// config
let canvasHeight = window.innerHeight - window.innerHeight%32 - 32 * 3;
let canvasWidth = window.innerWidth - window.innerWidth%32 - 32 * 3;

let Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu () {
        Phaser.Scene.call(this, 'menu');
    },

    create: function () {
        this.add.text(10, 10, '', { font: '25px Courier', fill: '#00ff00' });

        let gameOneText = this.add.text(100, 100, 'Maze 1 : using Recursive backtracker Algorithm', { font: '25px Courier', fill: '#00ff00' });
        gameOneText.setInteractive(new Phaser.Geom.Rectangle(0, 0, gameOneText.width, gameOneText.height), Phaser.Geom.Rectangle.Contains);
        gameOneText.on('pointerup', function () {
            this.scene.start('game1', 
                { gameHeight: canvasHeight, gameWidth: canvasWidth });
        }, this)

        let gameTwoText = this.add.text(100, 200, 'Maze 2 : using Hunt and Kill Algorithm', { font: '25px Courier', fill: '#00ff00' });
        gameTwoText.setInteractive(new Phaser.Geom.Rectangle(0, 0, gameTwoText.width, gameTwoText.height), Phaser.Geom.Rectangle.Contains);
        gameTwoText.on('pointerup', function () {
            this.scene.start('game2', 
                { gameHeight: canvasHeight, gameWidth: canvasWidth }
            );
        }, this)        

        this.events.on('shutdown', this.shutdown, this);
    },

    shutdown: function () {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();
    }

});

let config = {
    type: Phaser.WEBGL,
    width: canvasWidth,
    height: canvasHeight,
    autoCenter: Phaser.Scale.CENTER,
    mode: Phaser.Scale.FIT,
    backgroundColor: '#000000', 
    parent: 'phaser-example',
    scene: [ Menu, MazeGame1, MazeGame2, GameMessage]
};

let game = new Phaser.Game(config);
