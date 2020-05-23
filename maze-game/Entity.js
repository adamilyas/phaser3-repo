'use strict';

/**
 * @author adam
 * 
 */
class MazeTileMapGenerator {

    constructor(height, width, path_tile = 0, unvisited_tile = 1, wall_tile = 2){
        this.height = height;
        this.width = width;

        let tilemap = new Array(height).fill( new Array(width).fill(unvisited_tile) );

        // set first and last row to 2
        tilemap[0] = new Array(width).fill(wall_tile);
        tilemap[height-1] = new Array(width).fill(wall_tile);

        // set first and last column to 2
        tilemap.forEach(row => {
            row[0] = wall_tile;
            row[width-1] = wall_tile;
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
