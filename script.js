const windowInnerWidth = window.innerWidth - 20
const windowInnerHeight = window.innerHeight - 20


var client_id = Date.now()

var bx;
var by;
var chase = false
var cursors;

var hpTexttarget;
var mpTexttarget;

var timer;
var btn;

var dragpx = 100
var dragpy = windowInnerHeight - 100

var drgX;
var drgY;

var map;

var scene_main;
class MainScene extends Phaser.Scene {

    preload() {

        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/chars.png', { frameWidth: 16, frameHeight: 24 });
        this.load.image('btn', 'assets/star.png');
        this.load.image('SummerTiles', 'assets/map/SummerTiles.png')
        this.load.tilemapTiledJSON('map', 'assets/map/map.json')
        this.load.image('Chest', 'assets/Chest.png');
        this.load.spritesheet('Female1', 'assets/NPC/Female1.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Female2', 'assets/NPC/Female2.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Male1', 'assets/NPC/Male1.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Male2', 'assets/NPC/Male2.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Male3', 'assets/NPC/Male3.png', { frameWidth: 32, frameHeight: 48 });

        this.load.image('ClsdBtn', 'assets/closedbuttonpng.png');
        this.load.image('Apple', 'assets/equipment/Apple.png');
        this.load.image('Beer', 'assets/equipment/Beer.png');
        this.load.image('Bread', 'assets/equipment/Bread.png');
        this.load.image('Cheese', 'assets/equipment/Cheese.png');
        this.load.image('Ham', 'assets/equipment/Ham.png');
        this.load.image('Mushroom', 'assets/equipment/Mushroom.png');
        this.load.image('Wine', 'assets/equipment/Wine.png');
        this.load.image('CopperCoin', 'assets/CopperCoin.png');
        this.load.image('GoldenCoin', 'assets/GoldenCoin.png');
        this.load.image('SilverCoin', 'assets/SilverCoin.png');

    }

    create() {

        scene_main = this;

        map = this.make.tilemap({ key: 'map' })
        const tiles = map.addTilesetImage('SummerTiles', 'SummerTiles')
        const layer = map.createLayer('layer1', tiles, 0, 0);


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerdown', function (pointer, gameObject) {

            if (gameObject.length) {

                for (let i in drops) {
                    let element = drops[i];
                    if (element.sprite == gameObject[0]) {
                        scene_DropFrame.drop = element;
                        if (!scene_DropFrame.dropisopen){
                            scene_DropFrame.opendrop();
                        }
                        return
                    }
                }

                for (let i in mobs) {
                    let mobelement = mobs[i];
                    if (mobelement.sprite == gameObject[0]) {
                        player.target = mobelement;
                        return
                    }
                }

                for (let i in npcs) {
                    let npcelement = npcs[i];
                    if (npcelement.sprite == gameObject[0]) {
                        if (player.target == npcelement){
                            if (!scene_NpcDialoge.frameopen){
                                scene_NpcDialoge.opendialoge()
                            }
                            console.log('он показывал пиструн');
                        }
                        else{
                            player.target = npcelement;
                        }
                        return
                    }
                }

                for (let i in players) {
                    let playelement = players[i];
                    if (playelement.sprite == gameObject[0]) {
                        player.target = playelement;
                        return
                    }
                }

            }
            else {
                player.target = null;
            }

        });


    }

    update(p1, p2) {

    }


}

var config = {
    type: Phaser.AUTO,
    width: windowInnerWidth,
    height: windowInnerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    fps: 30,
    scene: MainScene
};

var game = new Phaser.Game(config);