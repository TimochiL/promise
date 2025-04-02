import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MenuOverlay extends Scene
{
    constructor (data)
    {
        super('MenuOverlay');
        this.butoon = data;
    }
    
    create ()
    {
        this.overlayBg = this.add.rectangle(512, 384, 1024, 768, 0x000000).setDepth(100); // opaque overlay

        this.title = this.add.image(512, 300, 'title').setDepth(100) // title image
            // .setScale(2.5)
            // .setTint(0x4caf4c)
            .setInteractive(); 

        // this.butoon.setInteractive(true);

        this.playButton = this.add.text(512, 460, 'PLAY', { // play button
            fontFamily: 'Arial Black', fontSize: 38, color: '#4caf4c',
            stroke: '#000000', strokeThickness: 16,
            align: 'center'
        })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerup', () => this.exitScene())
            .on('pointerdown', () => this.enterButtonRestState())
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState());

        this.overlayBg.alpha = 0;
        this.title.alpha = 0;
        this.playButton.alpha = 0;

        this.tweens.add({
            targets: [this.title, this.playButton],
            alpha: 1,
            duration: 3000,
            ease: 'Sine.easeInOut',
        });

        this.tweens.add({
            targets: [this.overlayBg],
            alpha: 0.4,
            duration: 3000,
            ease: 'Sine.easeInOut',
        });

        // this.scene.bringToTop();

        EventBus.emit('current-scene-ready', this);
        // this.scene.get('TitleEmma').events.on('butoon', butoon => { this.butoon = butoon.setInteractive(true); EventBus.emit('butoonOut', this.butoon); });
    }

    exitScene ()
    {
        this.enterButtonHoverState();
        this.tweens.add({
            targets: [this.overlayBg, this.title, this.playButton],
            alpha: 0,
            duration: 2000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // this.get('TitleEmma').events.on('TitleEmma', butoon => {
                //     this.butoon = butoon;
                //     this.butoon.setInteractive(true);
                //     this.events.emit('MenuOverlay', this.butoon);
                // });
                this.changeScene();
                
            }
        });
        
    }

    enterButtonHoverState ()
    {
        this.playButton.setStyle({
            fontSize: 40,
            color: '#3b883b',
            stroke: '#222222'
        })
    }
    
    enterButtonRestState ()
    {
        this.playButton.setStyle({
            fontSize: 38,
            color: '#4caf4c',
            stroke: '#000000',
        })
    }

    // enterTitle ()
    // {
    //     this.add.image(512, 300, 'title').setScale(0.5).setTint(0x4caf4c); // title image

    //     this.playButton = this.add.text(512, 460, 'PLAY', { // play button
    //         fontFamily: 'Arial Black', fontSize: 38, color: '#4caf4c',
    //         stroke: '#000000', strokeThickness: 16,
    //         align: 'center'
    //     })
    //         .setDepth(100)
    //         .setOrigin(0.5);

    //     this.playButton.setInteractive();

    //     this.playButton.on('pointerover', this.scene.stop('MenuOverlay'));
    // }

    // changeScene ()
    // {
    //     this.scene.start('TitleEmma');
    // }
    changeScene ()
    {
        // this.scene.resume('TitleEmma');
        // this.scene.get('TitleEmma').events.on('gameStart', butoon => this.events.emit('butoonEmit', butoon));
        this.events.emit('gameStart', { x: 100, y: 450 });
        this.scene.stop();
    }
}