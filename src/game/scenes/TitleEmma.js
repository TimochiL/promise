import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Phaser from "phaser";

export class TitleEmma extends Scene
{

    constructor ()
    {
        super('TitleEmma');
    }

    static visit = 0;

    create ()
    {
        // music
        this.farm_track = this.sound.add('farm-track');

        this.time.delayedCall(2000, () => {
            this.farm_track.play();
        });

        this.sound.pauseOnBlur = true;
        
        this.cameras.main.fadeIn(
            TitleEmma.visit == 0
            ? 2000
            : 500,
        0, 0, 0);

        this.bg = this.add.image(512, 384, 'background'); // sky image

        this.toemma = this.add.image(this.scale.width / 2, this.scale.height / 6, 'toemma').setAlpha(0);

        // this.fadeOverlay = this.add.rectangle(0, 0, 1024, 768, 0x000000, 0);
        
        this.add.image(512, 404, 'mountains2')//.setTint(0x659AAE);

        this.add.image(512, 454, 'farmland');

        this.disableRight = false;

        this.activeKeys = {
            left: false,
            right: false
        }

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();

        // if (this.cursors.right.isDown)  {
        //     if (this.player.x > 979) {
        //         this.cameras.main.fadeOut(500, 0, 0, 0);
        //         this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        //             this.changeScene();
        //         })
        //     }
        // }

        // this.loc = {
        //     x: -1,
        //     y: -1
        // };

        this.player = null;

        // Add ground
        this.barriers = this.physics.add.staticGroup();
        this.barriers.create(512, 760, 'barrier')
            .setScale(64, 1)
            .refreshBody();

        if (TitleEmma.visit == 0) { // If spawning after game overlay
            this.tweens.add({
                targets: this.bg,
                alpha: 0.99,
                duration: 4000,
                onComplete: () => {
                    this.bg.alpha = 1;
                    // this.scene.pause();
                    // this.events.emit('TitleEmma', this.tempButoon);
                    // this.get('MenuOverlay').events.on('MenuOverlay', butoon => this.tempButoon = butoon);
                    this.scene.launch('MenuOverlay');
                    // this.scene.get('MenuOverlay').events.on('butoonOut', butoon => this.tempButoon = butoon);
                    
                    this.scene.get('MenuOverlay')
                        .events.on('gameStart', started => {
                            this.spawnPlayer(started.x, started.y);
                        });

                }
            })
        } else { // If spawning from walking back
            this.spawnPlayer(this.scale.width - 100, 700);
        }
        
        this.windmill = this.add.sprite(256, 504, 'windmill');

        // this.platforms = this.physics.add.staticGroup();
        
        // for (let i=40; i<1024; i+=80)
        // {
        //     for (let j=728; j>648; j-=40)
        //     {
        //         this.platforms.create(i, j, 'dirt')
        //             .setTint(0xD3B683)
        //             .refreshBody();
        //     }
        // }

        // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
        //     this.scene.launch('MenuOverlay');
        // })
        // this.launchOverlayDelay = this.time.delayedCall(2000, this.scene.launch, ['MenuOverlay'], this);
        
        this.wheat = this.add.image(this.scale.width / 2, 654, 'wheat').setDepth(20);

        EventBus.emit('current-scene-ready', this);
        // EventBus.emit('butoon', this.tempButoon);

        TitleEmma.visit += 1;
    }

    movePlayerInputs ()
    {
        if (this.cursors.left.isDown)
        {
            this.player.setFlipX(false);
            this.player.setVelocityX(-240);

            if (!this.activeKeys.left) {
                this.player.anims.play('turn');
                this.player.anims.playAfterDelay('walk', 50);
                this.activeKeys.left = true;
            }
        }
        else if (this.cursors.right.isDown && !this.disableRight)
        {
            this.player.setFlipX(true);
            this.player.setVelocityX(240);

            if (!this.activeKeys.right) {
                this.player.anims.play('turn');
                this.player.anims.playAfterDelay('walk', 50);
                this.activeKeys.right = true;
            }

            if (this.player.x > 979) {
                this.disableRight = true;
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.changeScene();
                })
            }
            // this.player.anims.play('right', true);
        }
        else //if (this.cursors.left.isUp && this.cursors.right.isUp)
        {
            this.player.setVelocityX(0);

            if (this.activeKeys.left || this.activeKeys.right) {
                this.player.anims.playReverse('turn');

                this.activeKeys.left = false;
                this.activeKeys.right = false;
            }

            
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-460);
        }
    }

    spawnPlayer (x, y)
    {
        // this.gameStart = started;
        // this.tempButoon = this.add.rectangle(512, 384, 50, 50, 0x000000)
        //     .setInteractive();
        // this.tempButoon.on('pointerdown', () => this.changeScene());
        
        // Add player
        this.player = this.physics.add.sprite(x, y, 'emma').setDepth(10);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Add player-ground collider
        this.physics.add.collider(this.player, this.barriers);

        // this.movePlayerInputs();
        this.tweens.add({
            targets: this.toemma,
            alpha: 1,
            duration: 4000
        });
    }

    update ()
    {
        this.windmill.anims.play('windmillAnim', true);

        // Player movement
        if (this.player != null) {

            this.movePlayerInputs();

            
        }
        // this.add.image(this.scale.width / 2, 654, 'wheat');
    }

    changeScene ()
    {
        // EventBus.emit('createPlayerObject', {
        //     // loc: {
        //     x: 100,
        //     y: 600
        //     // },

        // });
        // this.scene.stop('TitleEmma');
        this.farm_track.stop();
        this.scene.start('PlatformScene', {
            // x: 100, y: 450
            player: {
                x: 100,
                y: this.scale.height - this.barriers.getChildren()[0].height - this.player.height
            }
        });
        
    }

}
