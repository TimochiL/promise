import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        //this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        //this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        //const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        // this.load.on('progress', (progress) => {

        //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        //     bar.width = 4 + (460 * progress);

        // });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        //  All
        this.load.image('barrier', 'barrier.png');
        this.load.audio('ocean-blue', 'ocean-blue.mp3');
        this.load.audio('farm-track', 'farm.mp3');

        //  MenuOverlay
        this.load.image('title', 'title.png');

        //  TitleEmma
        this.load.image('mountains', 'mountains.png');
        this.load.image('farmland', 'farmland.png');
        this.load.spritesheet('windmill', 'windmill.png', { frameWidth: 416, frameHeight: 416 });

        this.load.spritesheet('emma', 'emma.png', { frameWidth: 65,  frameHeight: 104});
        this.load.image('wheat', 'wheat.png');

        this.load.image('toemma', 'toemma.png');

        //  PlatformerScene & TitleTimo
        this.load.image('mountains2', 'mountains2.png');
        this.load.image('ocean', 'ocean.png');
        this.load.spritesheet('splash', 'splash.png', { frameWidth: 80, frameHeight: 65 });
        this.load.image('dock', 'dock.png');

        this.load.image('lilypad', 'lilypad.png');
        this.load.image('lilypad-flower', 'lilypad-flower.png');

        this.load.image('fromtimo', 'fromtimo.png');

        this.load.image('boat', 'boat.png');
        this.load.spritesheet('rock', 'rock.png', { frameWidth: 100, frameHeight: 70 });
        this.load.spritesheet('timo', 'timo.png', { frameWidth: 52, frameHeight: 104 });

        this.load.spritesheet('message', 'message.png', { frameWidth: 512, frameHeight: 72.6 });
        this.load.spritesheet('fireworks', 'fireworks.png', { frameWidth: 250, frameHeight: 237 });

        this.load.image('rocket', 'rocket.png');
        this.load.image('prom', 'prom.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.

        this.createPlayerAnims();

        this.anims.create({
            key: 'windmillAnim',
            frames: this.anims.generateFrameNumbers('windmill', { start: 0, end: 7 }),
            frameRate:  10,
            repeat: -1,
        });

        this.anims.create({
            key: 'splashAnim',
            frames: this.anims.generateFrameNumbers('splash', { start: 0, end: 13}),
            frameRate: 10,
        });
        
        this.anims.create({
            key: 'rockRise',
            frames: this.anims.generateFrameNumbers('rock', { start: 13, end: 18 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'rockSink',
            frames: this.anims.generateFrameNumbers('rock', { start: 0, end: 12 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'playMessage',
            frames: this.anims.generateFrameNumbers('message', { start: 0, end: 48 }),
            frameRate: 20,
            repeat: 0
        });

        this.fireworkFrames = [46]
        for (let i=0; i<46; i++) {
            this.fireworkFrames.push((i+19) % 46);
        }
        this.fireworkFrames.push(46);

        // console.log(this.fireworkFrames)

        this.anims.create({
            key: 'playFireworks',
            frames: this.anims.generateFrameNumbers('fireworks', { frames: this.fireworkFrames }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.start('TitleEmma');
        // this.scene.start('TitleTimo');
    }

    createPlayerAnims ()
    {
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('emma', { start: 0, end: 2 }),
            frameRate: 20,
            repeat: 0,
        });
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('emma', { start: 2, end: 3 }),
            frameRate: 4,
            repeat: -1,
        })
        // this.anims.create({
        //     key: 'turn',
        // });
        // this.anims.create({
        //     key: 'right',
        //     repeat: -1
        // });
    }
}
