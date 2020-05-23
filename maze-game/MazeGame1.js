// Game
var MazeGame1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Demo () {
        Phaser.Scene.call(this, { key: 'game1' });
    },

    init: function (data) {
        console.log('init', data);

        this.gameHeight = data.gameHeight;
        this.gameWidth = data.gameWidth;
        this.loopState = true;   
    
    },

    preload: function () {
        // this.load.image('tiles', [ 'assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png' ]);
        this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles_new.png');

        this.load.image('smile', 'assets/sprites/smile.png');
        this.load.image('arrow', 'assets/sprites/arrow.png');

        this.path_tile = 0;
        this.unvisited_tile = 41;
        this.wall_tile = 11;
        this.goal_tile = 84;

        this.in_stack_tile = 28;                
    },

    create: function (){

        let PATH = this.path_tile;
        let UNVISITED = this.unvisited_tile;
        let WALL = this.wall_tile;
        let GOAL = this.goal_tile;
        let IN_STACK = this.in_stack_tile;


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
        arrow = this.add.image( (tileMapHeight - 1.5) * unit , (tileMapWidth - 1.5) * unit, 'arrow').setScale(0.45);
        arrow.rotation += 1.55;
        arrow.setVisible(false);

        let stack = [];
        let previousTile = null;
        let currentTile = new MyTile( unit * 1.5 , unit * 1.5 );        
        let mazeGeneratingEvent = this.time.addEvent({
            delay: 0,
            callback: () => {
    
                // console.log(currentTile);

                // when there is no tile left to go. end maze generating event.
                if (currentTile == null){
                    if (stack.length === 0){

                        /**
                         * Stop maze generating event
                         * Find the end of the maze at the opposite corner
                         */
                        this.loopState = false;
                        
                        
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

                        // NO DEAD END FOUND. RESTARTING MAZE GENERATION

                        return;
                    } else {
                        currentTile = stack.pop();
                        return;
                    }
                } else if (currentTile.getIndex === WALL){
                    currentTile = stack.pop();
                    previousTile = null;
                }
    
                // walker on a unvisited tile to make it into a tile
                if (currentTile.getIndex() === UNVISITED || currentTile.getIndex() == IN_STACK){
                    currentTile.setIndex(0);
                } else {
                    currentTile.setIndex(WALL);
                    currentTile = stack.pop();
                    previousTile = null;
                    return;
                }
    
                let neighbours = currentTile
                    .getNeighbours()
                    .filter(myTile => myTile.getIndex() !== WALL && !myTile.equals(previousTile)); // remove previous tile from neighbours
    
                let visitedNeighbours = neighbours.filter(myTile => myTile.getIndex() === PATH);
                if (visitedNeighbours.length > PATH && previousTile !== null){
                    currentTile.setIndex(WALL);
                    currentTile = stack.pop();
                    previousTile = null;
                    return;
                }
    

                // i want neighbours to be not visited ( meaning: UNVISTED or INSTACK , basically NOT WALL OR PATH) 
                // AND none of it's neighbours to be a path
                
                neighbours = neighbours.filter(

                    myTile => 
                    
                    myTile.getIndex() === UNVISITED || myTile.getIndex() === IN_STACK && 

                    // PEEK FORWARD, if the neighbour of the currentTile's neighbour is a path, 
                    // set the currentTile's neighbour to be a wall
                    myTile.getNeighbours().filter(neighbourTile =>  {
                        if (!neighbourTile.equals(currentTile) && neighbourTile.getIndex() === PATH){
                            myTile.setIndex(WALL);
                            return true;
                        }
                    }).length === 0 &&

                    // make sure to return neighbour tiles that has not been turned to wall
                    myTile.getIndex() === UNVISITED || myTile.getIndex() === IN_STACK
                );

                if (neighbours.length === PATH){
                    // console.log("DEADEND");
                    currentTile = stack.pop();
                    previousTile = null;
                    return;
                }
            
                // set previous tile
                previousTile = currentTile;
    
                // set next tile
                let choice = Math.floor(Math.random() * neighbours.length);
                currentTile = neighbours[choice];
                neighbours.splice(choice , 1);
    
                if (neighbours.length > PATH){
                    choice = Math.floor(Math.random() * neighbours.length);
                    let wall = neighbours[choice];
                    wall.setIndex(WALL);
                    neighbours.splice(choice, 1);
                }
    
                if (neighbours.length > 0){
                    let neighbour_to_stack = neighbours[0];
                    neighbour_to_stack.setIndex(IN_STACK);

                    // console.log("Adding to stack");
                    // console.log(neighbour_to_stack);
                    stack.push(neighbour_to_stack);
                }
    
            },
            loop: this.loopState
        })

        cursors = this.input.keyboard.createCursorKeys();

        this.events.on('shutdown', this.shutdown, this);

    },

    shutdown: function () {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();
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
    
            if (tile.index !== this.wall_tile){
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