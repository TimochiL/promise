import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Phaser from "phaser";

export class PlatformScene extends Scene
{
    init (data)
    {
        this.x = data.player.x;
        this.y = data.player.y;
    }
    
    constructor ()
    {
        super('PlatformScene');
        
    }

    static visit = 0;

    create ()
    {
        // music
        this.ocean_blue = this.sound.add('ocean-blue');
        if (PlatformScene.visit === 0) {
            this.time.delayedCall(2000, () => {
                this.ocean_blue.play();
            });
        }

        this.sound.pauseOnBlur = true;
        
        this.cameras.main.fadeIn(500, 0, 0, 0);
        
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background'); //   Add bg

        this.fromtimo = this.add.image(this.scale.width / 2, this.scale.height / 6, 'fromtimo').setAlpha(0);

        this.add.image(this.scale.width / 2, 404, 'mountains'); // Add mtns

        this.ocean = this.add.image(this.scale.width / 2, 594, 'ocean').setTint(0x76bed8 );

        this.dock = this.add.image(125, this.scale.height - 55, 'dock').setDepth(5);

        this.splashArray = [];
        for (let i=0; i<64; i++) {
            let x = Phaser.Math.Between(0, this.scale.width);
            let y = Phaser.Math.Between(this.scale.height - (this.ocean.height / 2), this.scale.height);
            this.splashArray.push(this.add.sprite(x, y, 'splash'));
        }

        this.barrierOffset = 50;
        this.barriers = this.physics.add.staticGroup();
        this.barriers.create(125, 760 - this.barrierOffset, 'barrier')
            .setScale(10, 1)
            .refreshBody();
        // this.barriers.create(2 * this.scale.width / 3 - 30, 760 - this.barrierOffset, 'barrier')
        //     .setScale(40, 1)
        //     .refreshBody();

        for (let i=0; i<4; i++) {
            let x = this.scale.width - 180 * (i+1) + Phaser.Math.Between(-30, 30);
            let y = this.scale.height - this.barriers.getChildren()[0].height + Phaser.Math.Between(-10, 10);
            let pad = this.add.image(x, y, 'lilypad');
            this.barriers.create(x, y + pad.height / 2, 'barrier')
                .setScale(3, 2)
                .refreshBody();
        }

        this.flowerpad = this.add.image(this.scale.width - 40, this.scale.height - this.barrierOffset - 55, 'lilypad-flower');
        this.barriers.create(this.flowerpad.x, 760 - this.barrierOffset, 'barrier')
            .setScale(7, 1)
            .refreshBody();
        

        // for (let i=0; i<)

        this.spawnPlayer(this.x, this.y);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.activeKeys = {
            left: false,
            right: false
        }

        this.disabledControls = {
            left: false,
            right: false,
            
        };

        this.nextScene = {
            key: 'nextScene',
            player: {
                x: 0,
                y: this.scale.height - this.barriers.getChildren()[0].height - this.barrierOffset - (this.player.height / 2)
            }
        }

        // this.spawnPlayer(300, 450);
        
        // EventBus.on('createPlayerObject', (x, y) => {
        //     // this.loc = {
        //         this.x = x,
        //         this.y = y
        //     // }
        // })
        PlatformScene.visit += 1;

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        if (this.player != null) {
            this.movePlayerInputs();

            if (this.player.y >= this.scale.height - (4 * this.player.height / 5)) {
                this.player.setCollideWorldBounds(false);
            }
            if (this.player.y >= this.scale.height + this.player.height / 2) {
                this.player.setX(this.x).setY(this.y-15);
            }
        }

        this.splashArray[Phaser.Math.Between(0, 63)].anims.play('splashAnim', true);
    }

    movePlayerInputs ()
    {
        if (this.cursors.left.isDown && !this.disabledControls.left)
        {
            this.player.setFlipX(false);
            this.player.setVelocityX(-240);

            if (!this.activeKeys.left) {
                this.player.anims.play('turn');
                this.player.anims.playAfterDelay('walk', 50);
                this.activeKeys.left = true;
            }

            if (this.player.x <= this.player.width / 2) {
                this.disabledControls.left = true;
                this.nextScene.player.x = this.scale.width - 100;
                this.nextScene.key = 'TitleEmma';

                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.changeScene();
                })
            }

            // this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown && !this.disabledControls.right)
        {
            this.player.setFlipX(true);
            this.player.setVelocityX(240);

            if (!this.activeKeys.right) {
                this.player.anims.play('turn');
                this.player.anims.playAfterDelay('walk', 50);
                this.activeKeys.right = true;
            }

            // if (this.player.x >= this.dock.width - ( this.player.width / 2 )) {
            if (this.player.x >= this.scale.width - ( this.player.width / 2 )) {
                this.disabledControls.right = true;
                this.nextScene.player.x = 100;
                this.nextScene.key = 'TitleTimo'

                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.changeScene();
                })
            }

            // this.player.anims.play('right', true);
        }
        else
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

        // Add anims
        // this.createPlayerAnims()

        // Add player-ground collider
        this.physics.add.collider(this.player, this.barriers);

        // this.movePlayerInputs();
        this.tweens.add({
            targets: this.fromtimo,
            alpha: 1,
            duration: 4000
        });
    }

    changeScene ()
    {
        if (this.nextScene.key == 'TitleEmma') {
            this.ocean_blue.stop();
            PlatformScene.visit = 0;
        }

        // console.log(this.nextScene.player.x, this.nextScene.player.y);
        this.scene.start(this.nextScene.key, {
            player: {
                x: this.nextScene.player.x,
                y: this.nextScene.player.y,
            }
        });
    }
}