'use strict';

class MazeTileMapGenerator {
    constructor(height, width){
        this.height = height;
        this.width = width;

        let tilemap = new Array(height).fill( new Array(width).fill(1) );

        // set first and last row to 2
        tilemap[0] = new Array(width).fill(2);
        tilemap[height-1] = new Array(width).fill(2);

        // set first and last column to 2
        tilemap.forEach(row => {
            row[0] = 2;
            row[width-1] = 2;
        });

        this.tilemap = tilemap;

    }
}

class MyTile {

    constructor(x, y){
        this.x = x;
        this.y = y;
        let worldTile = layer.getTileAtWorldXY(x, y, true);
        this.worldTile = worldTile;
    }

    getNeighbours(){
        return [
            new MyTile(this.x+unit, this.y) , 
            new MyTile(this.x-unit, this.y), 
            new MyTile(this.x, this.y+unit), 
            new MyTile(this.x, this.y-unit)
        ];
    }

    equals(anotherTile){
        if (anotherTile === null){
            return false;
        } else if (this.x === anotherTile.x && this.y === anotherTile.y){
            return true;
        } else {
            return false;
        }
    }

    getIndex(){
        return this.worldTile.index;
    }

    setIndex(index){
        this.worldTile.index = index;
    }
}

// node TileMap.js
if (typeof require !== 'undefined' && require.main === module) {
    let gen = new MazeTileMapGenerator(5,5);
    console.log(gen.tilemap);
}
