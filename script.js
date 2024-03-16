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
var scene_CastFrame;

var spells = [];

spells.push({'id': 1, 'sprite': 'spell1', 'spelldata': ['rightup','left','rightdown']})
spells.push({'id': 2, 'sprite': 'spell2', 'spelldata': ['leftdown','right','leftup']})
spells.push({'id': 3, 'sprite': 'spell3', 'spelldata': ['leftdown','right','leftdown']})
spells.push({'id': 4, 'sprite': 'spell4', 'spelldata': ['leftdown','rightdown','rightup','leftup']})



class CastFrame extends Phaser.Scene {

    create() {
        scene_CastFrame = this;

        this.castopen = false;
        this.spell = NaN;
        this.beginDraw = 0
        this.drawPoint = []
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 100, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_CastFrame.close()
        });

        this.drawGraph = this.add.graphics();
        this.zone = this.add.zone(windowInnerWidth / 2, windowInnerHeight / 2, 200, 200).setInteractive();
        this.zone.visible = false;

        this.zone.on('pointermove', pointer => {

            if (this.drawPoint.length && Date.now() / 1000 - this.beginDraw > 3 && this.castopen) {
                this.beginDraw = 0;
                this.direction();
                this.drawPoint.splice(0, this.drawPoint.length);
                this.drawGraph.clear()
                this.drawGraph.lineStyle(4, 0x0000ff);
            }

            if (pointer.isDown) {

                let dx = pointer.position.x;
                let dy = pointer.position.y;
                let x = pointer.prevPosition.x;
                let y = pointer.prevPosition.y;

                if (!this.drawPoint.length) {
                    this.beginDraw = Date.now() / 1000;
                }

                this.drawPoint.push({ 'x': pointer.x, 'y': pointer.y })

                this.drawGraph.beginPath();
                this.drawGraph.moveTo(x, y);
                this.drawGraph.lineTo(dx, dy);
                this.drawGraph.stroke();
                this.drawGraph.closePath();
            }
            else{
                if (this.drawPoint.length && this.castopen) {
                    this.beginDraw = 0;
                    this.direction();
                    this.drawPoint.splice(0, this.drawPoint.length);
                    this.drawGraph.clear()
                    this.drawGraph.lineStyle(4, 0x0000ff);
                }    
            }

        });

    }

    update() {

    }

    direction() {
        let x = 0;
        let y = 0;
        let i = 0;
        let left = false;
        let right = false;
        let down = false;
        let up = false;
        let step = 10;
        let lastdirection = '';
        let direction = '';
        let distanse = 0;
        let maxind = this.drawPoint.length - 1;
        let dirarray = [];
        while (i <= maxind) {

            x = this.drawPoint[i].x;
            y = this.drawPoint[i].y;

            i += step;
            if (i > maxind) {
                i = maxind;
            }

            distanse = Math.sqrt((x - this.drawPoint[i].x) ** 2 + (y - this.drawPoint[i].y) ** 2);

            if (distanse < 10) {
                i += step;
                continue;
            }

            left = (x > this.drawPoint[i].x + 10);
            right = (x < this.drawPoint[i].x - 10);
            down = (y < this.drawPoint[i].y - 10);
            up = (y > this.drawPoint[i].y + 10);

            if (left && up) {
                direction = 'leftup';
            }
            else if (right && up) {
                direction = 'rightup';
            }
            else if (left && down) {
                direction = 'leftdown';
            }
            else if (right && down) {
                direction = 'rightdown';
            }
            else if (left) {
                direction = 'left';
            }
            else if (right) {
                direction = 'right';
            }
            else if (up) {
                direction = 'up';
            }
            else if (down) {
                direction = 'down';
            }



            if (lastdirection != direction) {
                lastdirection = direction;
                dirarray.push(lastdirection);
                console.log(lastdirection);
            }

            i += step;
        }

        if (this.spell.spelldata.length != dirarray.length){
            console.log('не шмогла');
            this.close();
        }
        else{

            for (let i in dirarray){
                let result = dirarray[i];
                let speldata = this.spell.spelldata[i];
                if (result!=speldata){
                    console.log('не шмогла');
                    this.close();
                    return;
                }
            }

            console.log('ШМОГЛААААААА');
            this.close();
        }

    }

    open(spell) {

        if (spell == NaN){
            return;
        }

        this.spell = spell;
        let xsize = windowInnerWidth / 2 - 100;
        let ysize = windowInnerHeight / 2 - 100;
        this.graphics.fillStyle(0x000000, 0.2);
        this.graphics.fillRect(xsize, ysize, 200, 200);
        this.drawGraph.fillStyle(0x000000, 0);
        this.drawGraph.fillRect(xsize, ysize, 200, 200);
        this.drawGraph.lineStyle(4, 0x0000ff);
        this.ClsdBtn.visible = true;
        this.ClsdBtn.setPosition(xsize + 200 - 10, ysize - 10)
        this.zone.visible = true;
        this.castopen = true;
    }

    close() {
        this.spell = NaN;
        this.ClsdBtn.visible = false;
        this.graphics.clear();
        this.drawGraph.clear();
        this.zone.visible = false;
        this.castopen = false
    }
}

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
        this.load.image('spell1', 'assets/spell1.png');
        this.load.image('spell2', 'assets/spell2.png');
        this.load.image('spell3', 'assets/spell3.png');
        this.load.image('spell4', 'assets/spell4.png');

    }

    create() {

        scene_main = this;

        map = this.make.tilemap({ key: 'map' })
        const tiles = map.addTilesetImage('SummerTiles', 'SummerTiles')
        const layer = map.createLayer('layer1', tiles, 0, 0);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        let step = 100 * spells.length;
        for (let i in spells){
            let element = spells[i];
            element.sprite = this.add.sprite(windowInnerWidth - 100, windowInnerHeight - step, element.sprite).setInteractive();
            step -= 100;
        }

        scene_main.scene.add('CastFrame', CastFrame, true, { x: 400, y: 300 });

        // this.castframe.on('pointerdown', function (pointer, gameObject) {

        //     if (!scene_CastFrame.castopen) {
        //         scene_CastFrame.open();
        //     }

        // });

        cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerdown', function (pointer, gameObject) {

            if (gameObject.length) {

                for (let i in spells){
                    let element = spells[i];
                    if (element.sprite == gameObject[0]){
                        scene_CastFrame.open(element);
                    }
                }

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