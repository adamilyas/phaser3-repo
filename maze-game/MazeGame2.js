// Game

/**
 * 
 * @param {number} gameHeight : height of the canvas with valid tile indexes
 * @param {number} gameWidth : width of the canvas with valid tile indexes
 * 
 * During generation, when current path walk reaches a dead end, algorithm will go into
 * hunting mode, which will find unvisited tiles with neighbours which are paths.
 */
let huntAndKill = function (gameHeight , gameWidth, path_tile, unvisited_tile, wall_tile){


    for (let y = unit * 1.5; y < gameHeight - unit; y+=unit) {
        for (let x = unit * 1.5; x < gameWidth - unit; x+=unit) {

            let myTile = new MyTile(x,y);
            if (myTile.getIndex() === unvisited_tile){
                let surroundingPaths = myTile.getNeighbours().filter(tile => tile.getIndex() === path_tile);
                if (surroundingPaths.length > 0){
                    return myTile;

                }
            }
        }
    }
    console.log("ENDING THE HUNT");
    this.loopState = false;
    return;
}

let MazeGame2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Demo () {
        Phaser.Scene.call(this, { key: 'game2' });
    },

    init: function (data) {
        console.log('init', data);

        this.gameHeight = data.gameHeight;
        this.gameWidth = data.gameWidth;
        this.loopState = true;
        
        // set which tiles
        this.path_tile = 0;
        this.unvisited_tile = 41;
        this.wall_tile = 11;
        this.goal_tile = 84;

    },

    preload: function () {
        this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles_new.png');
        this.load.image('smile', 'assets/sprites/smile.png');

    },

    create: function (){


        // tiles
        WALL = this.wall_tile;
        UNVISITED = this.unvisited_tile;
        PATH = this.path_tile;
        GOAL = this.goal_tile;

        let canvasHeight = this.gameHeight;
        let canvasWidth = this.gameWidth;

        let tileMapHeight = this.gameHeight / 32;
        let tileMapWidth = this.gameWidth / 32;

        let gen = new MazeTileMapGenerator(tileMapHeight , tileMapWidth, PATH, UNVISITED, WALL);
        let map = this.make.tilemap({
            data: gen.tilemap, 
            tileWidth: 32,
            tileHeight: 32
        });
        let tileset = map.addTilesetImage('tiles', null, 32, 32, 0, 0);

        layer = map.createDynamicLayer(0, tileset, 0, 0);            

        let menuText = this.add.text(10, 10, 'Click here to return to menu', { font: '16px Courier', fill: '#00ff00' });
        menuText.setInteractive(new Phaser.Geom.Rectangle(0, 0, menuText.width, menuText.height), Phaser.Geom.Rectangle.Contains);
        menuText.setVisible(false);

        let myText = this.add.text(10, 10, 'Click to pause maze generation', { font: '16px Courier', fill: '#00ff00' });
        myText.setInteractive(new Phaser.Geom.Rectangle(0, 0, myText.width, myText.height), Phaser.Geom.Rectangle.Contains);
        myText.on('pointerup', function () {
            console.log('click lci');
            if (mazeGeneratingEvent.paused){
                mazeGeneratingEvent.paused = false;
                myText.setText('Click to pause maze generation');
            } else {
                mazeGeneratingEvent.paused = true;
                myText.setText('Click to resume maze generation');
            }
        }, this)

        player = this.add.image(unit * 1.5, unit * 1.5, 'smile').setScale(0.45);

        // GENERATE MAZE
        let previousTile = null;
        let currentTile = new MyTile( unit * 1.5 , unit * 1.5 );

        let mazeGeneratingEvent = this.time.addEvent({
            delay: 0,
            callback: () => {

                // when there is no tile left to go. end maze generating event.
                if (currentTile == null){
                    this.loopState = false;


                    /**
                     * Find and set deadend as GOAL
                     */
                        /**
                         * For dead end. This will find a dead end at the far end of the maze, and set it
                         * to be the GOAL
                         */
                        const deadend_x = (tileMapWidth - 1.5) * unit;
                        const deadend_y = (tileMapHeight - 1.5) * unit;

                        // new MyTile(unit * 2.5, unit * 1.5).setIndex(GOAL); // for testing

                        for (let x = deadend_x; x > (tileMapWidth * unit)/1.5 ; x=x-unit) {
                            for (let y = deadend_y; y > (unit)/1.5 ; y=y-unit) {

                                let current_tile = new MyTile(x,y);
                                if (current_tile.getIndex() == PATH && 
                                    current_tile.getNeighbours().filter(n => n.getIndex() == WALL).length == 3){

                                    current_tile.setIndex(GOAL);

                                    myText.destroy();
                                    menuText.on('pointerup', function () {this.scene.start('menu');}, this)                           
                                    menuText.setVisible(true);

                                    mazeGeneratingEvent.paused = true;

                                    
                                    return;
                                }
                            }
                        }

                    return;
                }
    
                // walker on a unvisited tile to make it into a tile
                if (currentTile.getIndex() === UNVISITED){
                    currentTile.setIndex(PATH);
                } else {
                    currentTile.setIndex(WALL);
                    previousTile = null;
                    currentTile = huntAndKill(canvasHeight, canvasWidth, PATH, UNVISITED, WALL);;
                    return;
                }
    
                let neighbours = currentTile
                    .getNeighbours()
                    .filter(myTile => myTile.getIndex() !== WALL && !myTile.equals(previousTile));
    
                let visitedNeighbours = neighbours.filter(myTile => myTile.getIndex() === PATH);
                if (visitedNeighbours.length > 0 && previousTile !== null){
                    currentTile.setIndex(WALL);
                    previousTile = null;
                    currentTile = huntAndKill(canvasHeight, canvasWidth, PATH, UNVISITED, WALL);;
                    return;
                }
    
                // i want neighbours to be not visited ( index == 1) AND none of it's neighbours to be a path/
                neighbours = neighbours.filter(

                    myTile => 
                    
                    myTile.getIndex() === UNVISITED && 

                    // PEAK FORWARD, if the neighbour of the currentTile's neighbour is a path, 
                    // set the currentTile's neighbour to be a wall
                    myTile.getNeighbours().filter(neighbourTile =>  {
                        if (!neighbourTile.equals(currentTile) && neighbourTile.getIndex() === PATH){
                            myTile.setIndex(WALL);
                            return true;
                        }
                    }).length === 0 &&

                    // make sure any of the tiles that has been turned to walled
                    myTile.getIndex() === UNVISITED
                );

                if (neighbours.length === 0){
                    console.log("DEADEND");
                    previousTile = null;
                    currentTile = huntAndKill(canvasHeight, canvasWidth, PATH, UNVISITED, WALL);
                    return;
                }
            
                // set previous tile
                previousTile = currentTile;
    
                // set next tile
                let choice = Math.floor(Math.random() * neighbours.length);
                currentTile = neighbours[choice];
                neighbours.splice(choice , 1);
    
                if (neighbours.length > 0){
                    choice = Math.floor(Math.random() * neighbours.length);
                    let wall = neighbours[choice];
                    wall.setIndex(WALL);
                    neighbours.splice(choice, 1);
                }
            },
            loop: this.loopState
        })



        cursors = this.input.keyboard.createCursorKeys();       
    },




    update: function(){
    
        // if maze is still generating, dont move.
        if (this.loopState){
            return;
        }

        /**
         * 
         * This is the event when the player has reached the goal tile.
         * 
         */
        if (layer.getTileAtWorldXY(player.x, player.y, true).index == this.goal_tile){
            this.scene.start('gamemessage')
        }
    
        if (this.input.keyboard.checkDown(cursors.left, speedDelay)){
            let tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);
            
            if (tile.index !== this.wall_tile){
                player.x -= 32;
            }
        }
        else if (this.input.keyboard.checkDown(cursors.right, speedDelay)) {
            let tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);
    
            if (tile.index !==  this.wall_tile){
                player.x += 32;
            }
        }
        else if (this.input.keyboard.checkDown(cursors.up, speedDelay)) {
            let tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);
    
            if (tile.index !== this.wall_tile){
                player.y -= 32;
            }
        } else if (this.input.keyboard.checkDown(cursors.down, speedDelay)) {
            let tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);
    
            if (tile.index !== this.wall_tile){
                player.y += 32;
            }
        }
    }

});