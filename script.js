const windowInnerWidth = window.innerWidth
const windowInnerHeight = window.innerHeight


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


// var exemple = { x: windowInnerWidth - 155, y: windowInnerHeight - 40, stepx: 0, stepy: -10, steps: 20, stepcounter: 0 }
let ii = []
var exemple = [{ startx: - 155, starty: - 40, x:0, y:0, 
    direction:[{stepx: 0, stepy: -10, steps: 20, stepcounter: 0},
        {stepx: 5, stepy: 0, steps: 10, stepcounter: 0}]}]



spells.push({ 'id': 1, 'sprite': 'spell1', 'spelldata': [['rightup', 'left', 'rightdown'], ['up']] })
spells.push({ 'id': 2, 'sprite': 'spell2', 'spelldata': [['leftdown', 'right', 'leftup'], ['up']] })
spells.push({ 'id': 3, 'sprite': 'spell3', 'spelldata': [['leftdown', 'right', 'leftdown'], ['up']] })
spells.push({ 'id': 4, 'sprite': 'spell4', 'spelldata': [['leftdown', 'rightdown', 'rightup', 'leftup'], ['up']] })



class CastFrame extends Phaser.Scene {

    create() {
        scene_CastFrame = this;

        this.castopen = false;
        this.spell = NaN;
        this.spelldata = [];
        this.beginDraw = 0;
        this.nowDraw = 0;
        this.drawPoint = []
        this.text = this.add.text(10, 10, '...', { fontSize: '20px', fill: '#000' });

        this.text2 = this.add.text(200, 10, '...', { fontSize: '20px', fill: '#000' });

        this.text3 = this.add.text(10, 100, '...', { fontSize: '20px', fill: '#000' });

        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 100, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_CastFrame.close()
        });

        this.exemplestep = 0;
        this.exempleGraph = this.add.graphics();
        this.drawGraph = this.add.graphics();
        this.zone = this.add.zone(windowInnerWidth - 155, windowInnerHeight - 155, 300, 300).setInteractive();
        this.zone.visible = false;

        this.zone.on('pointermove', pointer => {

            if (pointer.isDown) {

                if (!this.drawPoint.length) {
                    this.beginDraw = Date.now() / 1000;
                }

                this.drawPoint.push({ 'x': pointer.x, 'y': pointer.y })

                let dx = pointer.position.x;
                let dy = pointer.position.y;
                let x = pointer.prevPosition.x;
                let y = pointer.prevPosition.y;

                this.drawGraph.beginPath();
                this.drawGraph.moveTo(x, y);
                this.drawGraph.lineTo(dx, dy);
                this.drawGraph.stroke();
                this.drawGraph.closePath();

                // this.nowDraw = Date.now();

            }

        });

        this.zone.on('pointerup', function (pointer) {

            scene_CastFrame.direction();
            scene_CastFrame.drawPoint.splice(0, scene_CastFrame.drawPoint.length);

        });

        this.zone.on('pointerout', function (pointer) {

            scene_CastFrame.direction();
            scene_CastFrame.drawPoint.splice(0, scene_CastFrame.drawPoint.length);

        });


    }

    update(p1, p2) {


        if (this.castopen) {
            this.exemplestep += 1;
            this.text3.setText(p2);
            if (this.exemplestep > 3) {
                let exemp;
                let ii = 0;
                for (ii in this.spelldata) {
                    if (!this.spelldata[ii].Done) {
                        break;
                    }
                }

                exemp = exemple[ii];

                let i = 0;
                for (i in exemp.direction){
                    if (exemp.direction[i].stepcounter <= exemp.direction[i].steps - 1){
                        break;
                    }
                }
                if (exemp.direction[i].stepcounter <= exemp.direction[i].steps - 1) {

                    let x1 = 0;
                    let y1 = 0;
                    if (exemp.direction[i].stepcounter == 0 && i == 0){
                        x1 = exemp.startx + windowInnerWidth;
                        y1 = exemp.starty + windowInnerHeight;
                    }
                    else{
                        x1 = exemp.x;
                        y1 = exemp.y;
                    }

                    let x2 = x1 + exemp.direction[i].stepx;
                    let y2 = y1 + exemp.direction[i].stepy;

                    exemp.x = x2;
                    exemp.y = y2;

                    this.exempleGraph.beginPath();
                    this.exempleGraph.moveTo(x1, y1);
                    this.exempleGraph.lineTo(x2, y2);
                    this.exempleGraph.stroke();
                    this.exempleGraph.closePath();
                    exemp.direction[i].stepcounter += 1;
                    this.exemplestep = 0;

                }
            }
            else{
                let fulldraw = true;
                for (let ii in this.spelldata){

                    // if (!this.spelldata[ii].Done) {
                    //     fulldraw = false;
                    //     break;
                    // }    

                    for (let i in exemple[ii].direction){
                        if (exemple[ii].direction[i].stepcounter <= exemple[ii].direction[i].steps - 1){
                            fulldraw = false;
                            break;
                        }
                    }

                    if (!fulldraw){
                        break;    
                    }
                    
                }
                if (fulldraw){
                    for (let i in exemple.direction){
                        exemple.direction[i].stepcounter = 0;
                    }
                    this.exemplestep = 0;
                    this.exempleGraph.clear();
                    this.exempleGraph.fillStyle(0x000000, 0);
                    this.exempleGraph.lineStyle(7, 0x0000ff);
                }
                    
            }

        }


        // let nowtime = Date.now() / 1000

        // if (this.drawPoint.length && nowtime - this.beginDraw > 3 && this.castopen) {
        //     this.beginDraw = 0;
        //     this.nowDraw = 0;
        //     this.direction();
        //     this.drawPoint.splice(0, this.drawPoint.length);
        //     this.drawGraph.clear()
        //     this.drawGraph.lineStyle(4, 0x0000ff);
        // }

    }

    direction() {
        this.beginDraw = 0;
        this.nowDraw = 0;
        let step = 2;

        let x = 0;
        let y = 0;
        let i = 0;

        let lastdirection = '';

        let maxind = this.drawPoint.length - 1;
        let dirarray = [];
        while (i <= maxind) {

            let direction = '';

            x = this.drawPoint[i].x;
            y = this.drawPoint[i].y;

            i += step;
            if (i > maxind) {
                i = maxind;
            }
            direction = this.calculateDirection(x, y, this.drawPoint[i].x, this.drawPoint[i].y);
            while (direction == '' && i <= maxind) {
                i += step;
                if (i > maxind) {
                    break;
                }
                direction = this.calculateDirection(x, y, this.drawPoint[i].x, this.drawPoint[i].y);
            }

            if (lastdirection != direction) {
                lastdirection = direction;
                dirarray.push({ 'direction': direction, 'counter': 1 });
                console.log(direction);
            }
            else {
                dirarray[dirarray.length - 1].counter += 1;
            }

            i += step;
        }

        this.processArrayDirections(dirarray);

        let arr = false;

        for (let ii in this.spelldata) {

            if (this.spelldata[ii].Done) {
                continue;
            }

            if (this.spelldata[ii].data.length != dirarray.length) {
                arr = true;
            }
            else {

                for (let i in dirarray) {
                    let result = dirarray[i];
                    let spelldata = this.spelldata[ii].data[i];
                    if (result != spelldata) {
                        arr = true;
                        break;
                    }
                }

            }

            if (arr) {
                console.log('не шмогла');
                this.drawGraph.clear();
                this.drawGraph.lineStyle(5, 0x0000ff);
                return;
            }
            else {
                this.spelldata[ii].Done = true;
                if (ii == 0) {
                    this.text.setText('Done')
                }
                else {
                    this.text2.setText('Done')
                }
                if (this.spelldata[this.spelldata.length - 1].Done) {
                    this.close();
                    return;
                }
                else {
                    this.drawGraph.clear();
                    this.drawGraph.lineStyle(5, 0x0000ff);
                    return;
                }
            }

        }


    }

    processArrayDirections(array) {

        let i = 0;
        while (i <= array.length - 1) {
            let strarray = array[i];
            if (strarray.counter <= 2) {
                array.splice(i, 1);
                continue;
            }

            array[i] = strarray.direction;

            i += 1;
        }

        i = 0;
        while (i <= array.length - 1) {
            if (i + 1 <= array.length - 1) {
                if (array[i] == array[i + 1]) {
                    array.splice(i + 1, 1);
                }
            }
            i += 1;
        }

    }

    calculateDirection(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);

        if (angle < 0) {
            angle += 360;
        }
        let direction = '';
        if (angle >= 345 || angle <= 15) {
            direction = 'right';
        }
        else if (angle >= 30 && angle < 60) {
            direction = 'rightdown';
        }
        else if (angle >= 75 && angle < 105) {
            direction = 'down';
        }
        else if (angle >= 120 && angle < 150) {
            direction = 'leftdown';
        }
        else if (angle >= 165 && angle < 195) {
            direction = 'left';
        }
        else if (angle >= 210 && angle < 240) {
            direction = 'leftup';
        }
        else if (angle >= 255 && angle < 285) {
            direction = 'up';
        }
        else if (angle >= 300 && angle < 330) {
            direction = 'rightup';
        }

        return direction;
    }

    open(spell) {

        if (spell == NaN) {
            return;
        }

        this.spell = spell;
        for (let i in this.spell.spelldata) {
            this.spelldata.push({ 'data': this.spell.spelldata[i], 'Done': false })
        }
        let xsize = windowInnerWidth - 310;
        let ysize = windowInnerHeight - 310;
        this.graphics.fillStyle(0x000000, 0.2);
        this.graphics.fillRect(xsize, ysize, 300, 300);
        this.exempleGraph.lineStyle(7, 0x0000ff);
        this.drawGraph.lineStyle(5, 0x0000ff);
        this.ClsdBtn.visible = true;
        this.ClsdBtn.setPosition(xsize + 300 - 10, ysize - 10)
        this.zone.visible = true;
        this.castopen = true;
        this.text.setText('...');
        this.text2.setText('...');

        for (let i in spells) {
            spells[i].sprite.visible = false;
        }


    }

    close() {
        this.spell = NaN;
        this.ClsdBtn.visible = false;
        this.graphics.clear();
        this.exempleGraph.clear()
        this.drawGraph.clear();
        this.zone.visible = false;
        this.spelldata = [];
        this.castopen = false
        for (let i in spells) {
            spells[i].sprite.visible = true;
        }
        this.exemplestep = 0;
    }
}

class MainScene extends Phaser.Scene {

    preload() {

        game.onResize()

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

        let step = 50 * spells.length;
        for (let i in spells) {
            let element = spells[i];
            element.sprite = this.add.sprite(windowInnerWidth - 40, windowInnerHeight - step, element.sprite).setInteractive();
            step -= 50;
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

var app = {
    width: 0,
    height: 0
}


let config = {
    type: Phaser.AUTO,
    width: windowInnerWidth,       // Стартовая ширина канваса  
    height: windowInnerHeight,     // Стартовая высота канваса
    virtualWidth: windowInnerWidth,             // Ширина проекта
    virtualHeight: windowInnerHeight,             // Высота проекта   
    orientation: 'landscape',       // Ориентация проекта: landscape или portrait
    backgroundColor: 0xff0000,      // Чистый цвет
    banner: false,                  // Cкрыть банер из консоли
    antialias: true,                // Сглаживание
    // disableContextMenu: true,       // Отключить меню по правому клику
    autoMobilePipeline: true,       // Оптимизация для мобильных устрйств
    resolution: 1,
    pixelArt: true,
    autoRound: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },              // Размеры холста в целых числах
    scene: MainScene                  // Сцена
}

var game = new Phaser.Game(config);

game.onResize = function () {

    // let size;

    // this.scale.resize(window.innerWidth, window.innerHeight);
    // this.scale.refresh();

    // if (config.orientation == "landscape") {
    //     size = config.virtualWidth

    // }else if (config.orientation == "portrait"){
    //     size = config.virtualHeight
    // }

    // if (window.innerWidth > window.innerHeight){
    //     this.renderer.projectionWidth = size * window.innerWidth/window.innerHeight;
    // 	this.renderer.projectionHeight = size;
    // }else{
    //     this.renderer.projectionWidth = size;
    // 	this.renderer.projectionHeight = size * window.innerHeight/window.innerWidth;
    // }

    // // Актуальные внутренние размеры игры
    // app.width = this.renderer.projectionWidth
    // app.height = this.renderer.projectionHeight

    // // Проходимся по всем объектам сцены
    // this.scene.scenes.forEach(function(scene) {
    //     scene.children.list.forEach(function(child) {
    //         if (typeof child.onResize === 'function') {
    //             child.onResize();
    //         }
    //     });
    // });

}
window.addEventListener("resize", game.onResize.bind(game), false)