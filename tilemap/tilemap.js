var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    //pixelArt: true,
    backgroundColor: '#000000', 
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var layer;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', [ 'assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png' ]);
    this.load.image('car', 'assets/sprites/car90.png');
    this.load.image('smile', 'assets/sprites/smile.png');

    this.load.tilemapCSV('map', 'assets/tilemaps/csv/grid.csv');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });

    var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);

    layer = map.createDynamicLayer(0, tileset, 0, 0);

    player = this.add.image(32+16, 32+16, 'smile').setScale(0.45);

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if (this.input.keyboard.checkDown(cursors.left, 100))
    {
        var tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.x -= 32;
            //player.angle = 180;
        }
    }
    else if (this.input.keyboard.checkDown(cursors.right, 100))
    {
        var tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.x += 32;
            //player.angle = 0;
        }
    }
    else if (this.input.keyboard.checkDown(cursors.up, 100))
    {
        var tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.y -= 32;
            //player.angle = -90;
        }
    }
    else if (this.input.keyboard.checkDown(cursors.down, 100))
    {
        var tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.y += 32;
            //player.angle = 90;
        }
    }
}