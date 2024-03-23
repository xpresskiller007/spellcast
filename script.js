const windowInnerWidth = window.innerWidth;
const windowInnerHeight = window.innerHeight;

var map;

var scene_main;
var scene_CastFrame;

var spells = [];

let exemp = [];

exemp = [{
    startx: - 250, starty: - 50, x: 0, y: 0,
    direction: [
        { stepx: 5, stepy: -5, steps: 40, stepcounter: 0 },
        { stepx: -10, stepy: 0, steps: 20, stepcounter: 0 },
        { stepx: 5, stepy: 5, steps: 40, stepcounter: 0 },
    ]
},
{
    startx: - 150, starty: - 40, x: 0, y: 0,
    direction: [{ stepx: 0, stepy: -10, steps: 25, stepcounter: 0 }]
}
];
spells.push({ 'id': 1, 'sprite': 'spell1', 'spelldata': [['rightup', 'left', 'rightdown'], ['up']], exemple: exemp })

exemp = [{
    startx: - 50, starty: - 270, x: 0, y: 0,
    direction: [
        { stepx: -5, stepy: 5, steps: 40, stepcounter: 0 },
        { stepx: 10, stepy: 0, steps: 20, stepcounter: 0 },
        { stepx: -5, stepy: -5, steps: 40, stepcounter: 0 },
    ]
},
{
    startx: - 150, starty: - 40, x: 0, y: 0,
    direction: [{ stepx: 0, stepy: -10, steps: 25, stepcounter: 0 }]
}
];
spells.push({ 'id': 2, 'sprite': 'spell2', 'spelldata': [['leftdown', 'right', 'leftup'], ['up']], exemple: exemp })

exemp = [{
    startx: - 100, starty: - 270, x: 0, y: 0,
    direction: [
        { stepx: -5, stepy: 5, steps: 20, stepcounter: 0 },
        { stepx: 10, stepy: 0, steps: 10, stepcounter: 0 },
        { stepx: -5, stepy: 5, steps: 20, stepcounter: 0 },
    ]
},
{
    startx: - 150, starty: - 40, x: 0, y: 0,
    direction: [{ stepx: 0, stepy: -10, steps: 25, stepcounter: 0 }]
}
];
spells.push({ 'id': 3, 'sprite': 'spell3', 'spelldata': [['leftdown', 'right', 'leftdown'], ['up']], exemple: exemp })

exemp = [{
    startx: - 150, starty: - 260, x: 0, y: 0,
    direction: [
        { stepx: -5, stepy: 5, steps: 20, stepcounter: 0 },
        { stepx: 5, stepy: 5, steps: 20, stepcounter: 0 },
        { stepx: 5, stepy: -5, steps: 20, stepcounter: 0 },
        { stepx: -5, stepy: -5, steps: 20, stepcounter: 0 },

    ]
},
{
    startx: - 150, starty: - 40, x: 0, y: 0,
    direction: [{ stepx: 0, stepy: -10, steps: 25, stepcounter: 0 }]
}
];
spells.push({ 'id': 4, 'sprite': 'spell4', 'spelldata': [['leftdown', 'rightdown', 'rightup', 'leftup'], ['up']], exemple: exemp })


class CastFrame extends Phaser.Scene {

    create() {
        scene_CastFrame = this;

        this.castopen = false;
        this.spell = NaN;
        this.exemple = [];
        this.spelldata = [];
        this.isDraw = false;
        this.beginDraw = 0;
        this.nowDraw = 0;
        this.drawPoint = []

        this.resultDraw = this.add.graphics();
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 100, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_CastFrame.close()
        });

        this.exemplestep = Date.now();
        this.exempleGraph = this.add.graphics();
        this.drawGraph = this.add.graphics();
        this.zone = this.add.zone(windowInnerWidth - 155, windowInnerHeight - 155, 300, 300).setInteractive();
        this.zone.visible = false;

        this.zone.on('pointermove', pointer => {

            if (pointer.isDown) {

                if (!this.isDraw) {
                    this.clearExemple()
                }

                this.isDraw = true;

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
            }

        });

        this.zone.on('pointerup', function (pointer) {

            scene_CastFrame.direction();
            scene_CastFrame.drawPoint.splice(0, scene_CastFrame.drawPoint.length);
            scene_CastFrame.isDraw = false;

        });

        this.zone.on('pointerout', function (pointer) {

            scene_CastFrame.direction();
            scene_CastFrame.drawPoint.splice(0, scene_CastFrame.drawPoint.length);
            scene_CastFrame.isDraw = false;

        });


    }

    update(p1, p2) {

        if (!this.exemple.length){
            return;
        }

        if (this.castopen && !this.isDraw) {
            for (let ii in this.spelldata) {

                if (this.spelldata[ii].Done) {
                    continue;
                }

                let exemp = this.exemple[ii];

                for (let i in exemp.direction) {
                    while (exemp.direction[i].stepcounter <= exemp.direction[i].steps - 1 && Date.now() - this.exemplestep > 15) {

                        let x1 = 0;
                        let y1 = 0;
                        if (exemp.direction[i].stepcounter == 0 && i == 0) {
                            x1 = exemp.startx + windowInnerWidth;
                            y1 = exemp.starty + windowInnerHeight;
                        }
                        else {
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
                        this.exemplestep = Date.now();

                    }

                }

            }

        }

        let exemp = this.exemple[this.exemple.length - 1];
        let lastdir = exemp.direction[exemp.direction.length - 1];
        let clear = lastdir.stepcounter == lastdir.steps
        if (clear) {
            this.clearExemple()
        }

    }

    clearExemple() {

        for (let ii in this.exemple) {
            let exemp = this.exemple[ii];
            exemp.x = 0;
            exemp.y = 0;
            for (let i in exemp.direction) {
                exemp.direction[i].stepcounter = 0;
            }
        }
        this.exempleGraph.clear();
        this.exempleGraph.lineStyle(7, 0x0000ff);
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
                this.drawResult(ii);

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

    drawResult(ind) {

        let exemp = this.exemple[ind];

        for (let i in exemp.direction) {
            while (exemp.direction[i].stepcounter <= exemp.direction[i].steps - 1) {

                let x1 = 0;
                let y1 = 0;
                if (exemp.direction[i].stepcounter == 0 && i == 0) {
                    x1 = exemp.startx + windowInnerWidth;
                    y1 = exemp.starty + windowInnerHeight;
                }
                else {
                    x1 = exemp.x;
                    y1 = exemp.y;
                }

                let x2 = x1 + exemp.direction[i].stepx;
                let y2 = y1 + exemp.direction[i].stepy;

                exemp.x = x2;
                exemp.y = y2;

                this.resultDraw.beginPath();
                this.resultDraw.moveTo(x1, y1);
                this.resultDraw.lineTo(x2, y2);
                this.resultDraw.stroke();
                this.resultDraw.closePath();
                exemp.direction[i].stepcounter += 1;

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
        this.exemple = this.spell.exemple;
        this.clearExemple()
        for (let i in this.spell.spelldata) {
            this.spelldata.push({ 'data': this.spell.spelldata[i], 'Done': false })
        }
        let xsize = windowInnerWidth - 310;
        let ysize = windowInnerHeight - 310;
        this.resultDraw.lineStyle(5, 0x000000);
        this.graphics.fillStyle(0x000000, 0.2);
        this.graphics.fillRect(xsize, ysize, 300, 300);
        this.exempleGraph.lineStyle(7, 0x0000ff);
        this.drawGraph.lineStyle(5, 0x0000ff);
        this.ClsdBtn.visible = true;
        this.ClsdBtn.setPosition(xsize + 300 - 10, ysize - 10)
        this.zone.visible = true;
        this.castopen = true;

        for (let i in spells) {
            spells[i].sprite.visible = false;
        }

        this.exemplestep = Date.now();


    }

    close() {
        this.clearExemple()
        this.spell = NaN;
        this.ClsdBtn.visible = false;
        this.resultDraw.clear();
        this.graphics.clear();
        this.exempleGraph.clear()
        this.drawGraph.clear();
        this.zone.visible = false;
        this.spelldata = [];
        this.castopen = false
        for (let i in spells) {
            spells[i].sprite.visible = true;
        }
        this.exemple = [];
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