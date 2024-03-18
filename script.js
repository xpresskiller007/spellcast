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

spells.push({ 'id': 1, 'sprite': 'spell1', 'spelldata': [['rightup', 'left', 'rightdown'], ['up']] })
spells.push({ 'id': 2, 'sprite': 'spell2', 'spelldata': [['leftdown', 'right', 'leftup'], ['up']] })
spells.push({ 'id': 3, 'sprite': 'spell3', 'spelldata': [['leftdown', 'right', 'leftdown'], ['up']] })
spells.push({ 'id': 4, 'sprite': 'spell4', 'spelldata': [['leftdown', 'rightdown', 'rightup', 'leftup'], ['up']] })



class CastFrame extends Phaser.Scene {

    create() {
        scene_CastFrame = this;

        this.castopen = false;
        this.spell = NaN;
        this.beginDraw = 0;
        this.nowDraw = 0;
        this.drawPoint = []
        this.text = this.add.text(10, 10, '...', { fontSize: '20px', fill: '#000' });

        this.text2 = this.add.text(200, 10, '...', { fontSize: '20px', fill: '#000' });

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

            if (pointer.isDown) {

                let pointerx = pointer.x;
                let pointery = pointer.y;

                if (!this.drawPoint.length) {
                    this.beginDraw = Date.now() / 1000;
                    this.drawPoint.push([])
                }
                else {
                    let lastarray = this.drawPoint[this.drawPoint.length - 1]
                    let strarray = lastarray[lastarray.length - 1]
                    let px = pointerx - strarray.x;
                    let py = pointery - strarray.y;
                    if (px >= 50 || px <= -50 || py >= 50 || py <= -50) {
                        this.drawPoint.push([])
                    }
                }

                let array = this.drawPoint[this.drawPoint.length - 1];
                array.push({ 'x': pointer.x, 'y': pointer.y })

                let dx = pointer.position.x;
                let dy = pointer.position.y;
                let x = pointer.prevPosition.x;
                let y = pointer.prevPosition.y;

                this.drawGraph.beginPath();
                this.drawGraph.moveTo(x, y);
                this.drawGraph.lineTo(dx, dy);
                this.drawGraph.stroke();
                this.drawGraph.closePath();

                this.nowDraw = Date.now() / 1000;;

            }

        });

    }

    update() {

        let nowtime = Date.now() / 1000

        if (this.drawPoint.length && (nowtime - this.beginDraw > 10 || nowtime - this.nowDraw > 3) && this.castopen) {
            this.beginDraw = 0;
            this.nowDraw = 0;
            this.direction();
            this.drawPoint.splice(0, this.drawPoint.length);
            this.drawGraph.clear()
            this.drawGraph.lineStyle(4, 0x0000ff);
        }

    }

    direction() {
        let step = 2;
        let array;
        let arr = false;
        for (let iar in this.drawPoint) {

            let x = 0;
            let y = 0;
            let i = 0;

            let lastdirection = '';

            array = this.drawPoint[iar];

            let maxind = array.length - 1;
            let dirarray = [];
            while (i <= maxind) {

                let direction = '';

                x = array[i].x;
                y = array[i].y;

                i += step;
                if (i > maxind) {
                    i = maxind;
                }
                direction = this.calculateDirection(x, y, array[i].x, array[i].y);
                while(direction == ''  && i <= maxind){
                    i += step;
                    if (i > maxind){
                        break;
                    }
                    direction = this.calculateDirection(x, y, array[i].x, array[i].y);
                }

                if (lastdirection != direction) {
                    lastdirection = direction;
                    dirarray.push({'direction': direction, 'counter': 1});
                    console.log(direction);
                }
                else{
                    dirarray[dirarray.length-1].counter += 1;
                }

                i += step;
            }

            let text = []

            for (let ii in dirarray){
                let strdir = dirarray[ii]
                text.push(strdir.direction + ' ' + strdir.counter);   
            }

            this.text.setText(text);

            this.processArrayDirections(dirarray);

            text = []

            for (let ii in dirarray){
                let strdir = dirarray[ii]
                text.push(strdir.direction + ' ' + strdir.counter);   
            }

            this.text2.setText(text);

            this.drawGraph.clear();
            return;
            if (this.spell.spelldata[iar].length != dirarray.length) {
                arr = true;
                break;
            }
            else {

                for (let i in dirarray) {
                    let result = dirarray[i];
                    let speldata = this.spell.spelldata[iar][i];
                    if (result != speldata) {
                        arr = true;
                        break;
                    }
                }

            }

        }

        if (arr) {
            console.log('не шмогла');
        }
        else {
            console.log('ШМОГЛААААААА');
            this.close();
        }


    }

    processArrayDirections(array){

        let i = 0;
        while (i <= array.length-1){
            let strarray = array[i];
            if (strarray.counter <= 2){
                array.splice(i, 1);
                continue;
            }

            strarray = strarray.direction;

            i += 1;
        }

        i = 0;
        while (i <= array.length-1){
            if (i+1 <= array.length-1){
                if (array[i] == array[i+1]){
                    array.splice(i+1, 1);    
                }
            }
            i += 1;
        }

    }

    calculateDirection(x1, y1, x2, y2){
        let dx = x2-x1;
        let dy = y2-y1;
        let angle = Math.atan2(dy,dx)*(180/Math.PI);

        if (angle<0){
            angle += 360;
        }
        let direction = '';
        if (angle>=345 || angle<=15){
            direction = 'right';    
        }
        else if (angle>=30 && angle<60){
            direction = 'rightdown';    
        }
        else if (angle>=75 && angle<105){
            direction = 'down';    
        }
        else if (angle>=120 && angle<150){
            direction = 'leftdown';    
        }
        else if (angle>=165 && angle<195){
            direction = 'left';    
        }
        else if (angle>=210 && angle<240){
            direction = 'leftup';    
        }
        else if (angle>=255 && angle<285){
            direction = 'up';    
        }
        else if (angle>=300 && angle<330){
            direction = 'rightup';    
        }

        return direction;
    }

    open(spell) {

        if (spell == NaN) {
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
        for (let i in spells) {
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

                for (let i in spells) {
                    let element = spells[i];
                    if (element.sprite == gameObject[0]) {
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