let gen = new MazeTileMapGenerator(Math.floor(window.innerHeight/32) , Math.floor(window.innerWidth/32));
// let gen = new MazeTileMapGenerator(30, 30);

const unit = 32;

let zoom = 1;

let config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'phaser-example',
    backgroundColor: '#000000', 
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let layer;
let speedDelay = 75;
let powerUp = false;

let game = new Phaser.Game(config);

function preload (){
    this.load.image('tiles', [ 'assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png' ]);
    this.load.image('smile', 'assets/sprites/smile.png');
    this.load.tilemapCSV('map', 'assets/tilemaps/csv/grid.csv');
}

function create(){

    let tileConfig = {
        data: gen.tilemap,  // [ [], [], ... ]
        tileWidth: 32,
        tileHeight: 32
    }

    let map = this.make.tilemap(tileConfig);
    let tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);

    layer = map.createDynamicLayer(0, tileset, 0, 0);

    player = this.add.image(32 * 1.5, 32 * 1.5, 'smile').setScale(0.45);

    cursors = this.input.keyboard.createCursorKeys();
    
    // game.scale.setZoom(1.5)

    let loopState = true;

    let stack = [];
    let previousTile = null;
    let currentTile = new MyTile( unit * 1.5 , unit * 1.5 );

    this.time.addEvent({
        delay: 0,
        callback: () => {

            // when there is no tile left to go. end maze generating event.
            if (currentTile == null){
                if (stack.length === 0){
                    loopState = false;
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
                .filter(myTile => myTile.getIndex() !== 2 && !myTile.equals(previousTile));

            let visitedNeighbours = neighbours.filter(myTile => myTile.getIndex() === 0);
            console.log('Checking visited neighbours');
            console.log(visitedNeighbours);
            if (visitedNeighbours.length > 0 && previousTile !== null){
                console.log('There is visited neighbours');
                console.log(visitedNeighbours);
                currentTile.setIndex(2);
                currentTile = stack.pop();
                previousTile = null;
                return;
            }


            // i want neighbours to be not visited ( index == 1) AND none of it's neighbours to be a path
            neighbours = neighbours.filter(
                myTile => myTile.getIndex() === 1  // && myTile.getNeighbours().filter(neighbourTile => !neighbourTile.equals(myTile) && neighbourTile.getIndex() === 0 ).length === 0 
            );

            if (neighbours.length === 0){
                console.log("DEADEND");
                currentTile = stack.pop();
                previousTile = null;
                return;
            }

            // if neighbours have visited neighbours, 

        
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
}



























function update(){
    
    let pauseState = false;
    let spacebarState = this.input.keyboard.addKey('SPACE');
    spacebarState.on('down', 
        event => {
            if (pauseState){
                console.log('RESUME');
                pauseState = false;
                this.scene.resume();
            } else {

                console.log('PAUSE');
                pauseState = true ;
                this.scene.pause();
            }
        }
    );

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