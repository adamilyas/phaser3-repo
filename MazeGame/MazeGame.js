// Constants
const unit = 32;

// Variables
let player;
let layer;
let speedDelay = 75;
let loopState = true;

// Game
var MazeGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Demo () {
        Phaser.Scene.call(this, { key: 'game' });
    },

    init: function (data) {
        console.log('init', data);

        this.imageID = data.id;
        this.imageFile = data.image;

        loopState = true;        
    },

    preload: function () {
        this.load.image('tiles', [ 'assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png' ]);
        this.load.image('smile', 'assets/sprites/smile.png');
        this.load.tilemapCSV('map', 'assets/tilemaps/csv/grid.csv');

    },

    create: function (){

        let gen = new MazeTileMapGenerator(Math.floor(window.innerHeight/32) , Math.floor(window.innerWidth/32));
        let map = this.make.tilemap({
            data: gen.tilemap, 
            tileWidth: 32,
            tileHeight: 32
        });
        let tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);

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




        let stack = [];
        let previousTile = null;
        let currentTile = new MyTile( unit * 1.5 , unit * 1.5 );        
        let mazeGeneratingEvent = this.time.addEvent({
            delay: 0,
            callback: () => {
    
                console.log(currentTile);

                // when there is no tile left to go. end maze generating event.
                if (currentTile == null){
                    if (stack.length === 0){
                        loopState = false;

                        // change the pause for now...
                        myText.destroy();
                        menuText.on('pointerup', function () {this.scene.start('menu');}, this)                           
                        menuText.setVisible(true);

                        return;
                    } else {
                        currentTile = stack.pop();
                        return;
                    }
                } else if (currentTile.getIndex === 2){
                    currentTile = stack.pop();
                    previousTile = null;
                }
    
                // walker on a unvisited tile to make it into a tile
                if (currentTile.getIndex() === 1){
                    currentTile.setIndex(0);
                } else {
                    currentTile.setIndex(2);
                    currentTile = stack.pop();
                    previousTile = null;
                    return;
                }
    
                let neighbours = currentTile
                    .getNeighbours()
                    .filter(myTile => myTile.getIndex() !== 2 && !myTile.equals(previousTile)); // remove previous tile from neighbours
    
                let visitedNeighbours = neighbours.filter(myTile => myTile.getIndex() === 0);
                if (visitedNeighbours.length > 0 && previousTile !== null){
                    currentTile.setIndex(2);
                    currentTile = stack.pop();
                    previousTile = null;
                    return;
                }
    
                // i want neighbours to be not visited ( index == 1) AND none of it's neighbours to be a path/
                neighbours = neighbours.filter(

                    myTile => 
                    
                    myTile.getIndex() === 1 && 

                    // PEAK FORWARD, if the neighbour of the currentTile's neighbour is a path, 
                    // set the currentTile's neighbour to be a wall
                    myTile.getNeighbours().filter(neighbourTile =>  {
                        if (!neighbourTile.equals(currentTile) && neighbourTile.getIndex() === 0){
                            myTile.setIndex(2);
                            return true;
                        }
                    }).length === 0 &&

                    // make sure any of the tiles that has been turned to walled
                    myTile.getIndex() === 1
                );

                if (neighbours.length === 0){
                    console.log("DEADEND");
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
    
                if (neighbours.length > 0){
                    choice = Math.floor(Math.random() * neighbours.length);
                    let wall = neighbours[choice];
                    wall.setIndex(2);
                    neighbours.splice(choice, 1);
                }
    
                if (neighbours.length > 0){
                    stack.push(neighbours[0])
                }
    
            },
            loop: loopState
        })



        cursors = this.input.keyboard.createCursorKeys();       
    },




    update: function(){
    
        // if maze is still generating, dont move.
        if (loopState){
            return;
        }
    
    
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