// Constants
const unit = 32;

// Variables
let player;
let layer;
let speedDelay = 75;

/**
 * @param {number} x_start : unit * 2.5
 */
async function recursiveDivision(x_start, x_end, y_start, y_end, PATH, UNVISITED, WALL){

    await new Promise(resolve => setTimeout(resolve, 700));

    if ( (x_end - x_start <= 3 * unit) || (y_end - y_start <= 3 * unit)){
        return;
    }

    let x_candidates = [];
    let y_candidates = [];


    // 2 * unit from the wall

    for (let x = x_start + 2 * unit; x < x_end - unit; x+=2*unit) {
        // layer.getTileAtWorldXY(x, unit*0.5, true).index = 28;
        x_candidates.push(x);
    }


    for (let y = y_start + 2 * unit; y < y_end - unit; y+=2*unit) {
        // layer.getTileAtWorldXY(unit*0.5, y, true).index = 28;   
        y_candidates.push(y);
    }

    let i = Math.floor(Math.random() * x_candidates.length); // refering to the index to choose from x candidates
    let j = Math.floor(Math.random() * y_candidates.length); // refering to the index to choose from y candidates

    let x_choice = x_candidates[i];
    let y_choice = y_candidates[j];

    let vertical_wall = [] // contains y. x coord is x_choice
    for (let y = y_start + unit, i = 0; y < y_end; y+=unit, i++) {
        let tile = layer.getTileAtWorldXY(x_choice, y, true);
        if (tile.index !== PATH){
            tile.index = WALL;

            if (i%2 == 0){
                vertical_wall.push(y); // TODO:
            }
        }           
    }

    let horizontal_wall = [] // contains x. y coord is x_choice

    for (let x = x_start + unit, i = 0; x < x_end  ; x+=unit, i++) {
        let tile = layer.getTileAtWorldXY(x, y_choice, true);
        if (tile.index !== PATH){
            tile.index = WALL;
            if (i%2 == 0){
                horizontal_wall.push(x); // TODO:
            }
        }                    
    }

    // choose 3 of the 4 walls at random
    let wall1 = vertical_wall.filter(y =>  y < y_choice);
    let wall2 = vertical_wall.filter(y =>  y > y_choice);
    let wall3 = horizontal_wall.filter(x =>  x < x_choice);
    let wall4 = horizontal_wall.filter(x =>  x > x_choice);

    let not_to_choose_index = Math.floor(Math.random() * 4);
    walls_to_choose = [wall1, wall2, wall3, wall4];
    for (let i = 0; i < walls_to_choose.length; i++) {
        if (i !== not_to_choose_index){
        // if (true){
            const wall = walls_to_choose[i];
            if (i < 2){
                // wal 1 and wall 2 are vertical walls, use x_choice
                // and randomly choose a point in the wall
                y_hole = wall[Math.floor(Math.random() * wall.length)]
                layer.getTileAtWorldXY(x_choice, y_hole, true).index = PATH;
                let neighbour1 = layer.getTileAtWorldXY(x_choice, y_hole, true)


            } else {
                // wall 3 and wall 4 are horizontal walls, use y_choice
                // and randomly choose a point in the wall
                x_hole = wall[Math.floor(Math.random() * wall.length)]
                layer.getTileAtWorldXY(x_hole, y_choice, true).index = PATH;      
            }
        }
    }

    recursiveDivision(x_start, x_choice, y_start, y_choice, PATH, UNVISITED, WALL);

    recursiveDivision(x_choice, x_end, y_start, y_choice, PATH, UNVISITED, WALL);

    recursiveDivision(x_start, x_choice, y_choice, y_end, PATH, UNVISITED, WALL);

    recursiveDivision(x_choice, x_end,  y_choice, y_end, PATH, UNVISITED, WALL);


}

// Game
var MazeGame0 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Demo () {
        Phaser.Scene.call(this, { key: 'game0' });
    },

    init: function (data) {
        console.log('init', data);

        this.gameHeight = data.gameHeight;
        this.gameWidth = data.gameWidth;
        this.loopState = true;   
    
    },

    preload: function () {
        this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles_new.png');

        this.load.image('smile', 'assets/sprites/smile.png');
        this.load.image('arrow', 'assets/sprites/arrow.png');

        this.path_tile = 0;
        this.unvisited_tile = 83;
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
        menuText.on('pointerup', function () {
            this.scene.start('menu');
        }, this)  


        player = this.add.image(unit * 1.5, unit * 1.5, 'smile').setScale(0.45);

        let mazeGeneratingEvent = this.time.addEvent({
            delay: 0,
            callback: () => {

                recursiveDivision(
                    unit * 0.5, 
                    this.gameWidth - unit * 0.5, 
                    unit * 0.5, 
                    this.gameHeight - unit * 0.5,
                    PATH, UNVISITED, WALL
                );

                const deadend_x = (tileMapWidth - 1.5) * unit;
                const deadend_y = (tileMapHeight - 1.5) * unit;
                layer.getTileAtWorldXY(deadend_x, deadend_y, true).index = GOAL;



            },
            loop: false
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
            // return;
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