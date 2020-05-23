let GameMessage = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu () {
        Phaser.Scene.call(this, 'gamemessage');
    },

    create: function () {

        let randomProject = this.add.text(100, 100, 'Click here to see other random stuff by me', { 
            font: '25px Calibri', color: '#000000' , backgroundColor: "#cfcfc4",
            padding: {left: 20, right: 20, top: 20, bottom: 20},
            fixedWidth: 500,
            // ,fixedHeight: 300,
            wordWrap: {width: 500}
        }
        );
        randomProject.setInteractive(new Phaser.Geom.Rectangle(0, 0, randomProject.width, randomProject.height), Phaser.Geom.Rectangle.Contains);
        randomProject.on('pointerup', function () {
            // this.scene.start('menu');
            window.open("http://adamilyas.github.io/");
        }, this)

        let backToMenu = this.add.text(100, 200, 'Back to Menu', { 
            font: '25px Calibri', color: '#000000' , backgroundColor: "#cfcfc4",
            padding: {left: 20, right: 20, top: 20, bottom: 20},
            fixedWidth: 500,
            // ,fixedHeight: 300,
            wordWrap: {width: 500}
        }
        );
        backToMenu.setInteractive(new Phaser.Geom.Rectangle(0, 0, backToMenu.width, backToMenu.height), Phaser.Geom.Rectangle.Contains);
        backToMenu.on('pointerup', function () {
            this.scene.start('menu');
        }, this)



        this.events.on('shutdown', this.shutdown, this);
    },

    shutdown: function () {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();
    }

});
