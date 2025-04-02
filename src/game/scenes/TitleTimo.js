import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Phaser from "phaser";

export class TitleTimo extends Scene
{
    init (data)
    {
        this.x = data.player.x;
        this.y = data.player.y;
    }
    
    constructor ()
    {
        super('TitleTimo');
        
    }

    create ()
    {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.sunsetPurp = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x513f65).setDepth(-10);
        
        this.sunset = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x950606).setDepth(-10);
        
        this.bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setDepth(-10); //   Add bg

        //create fireworks
        this.createFireworks();

        this.mtns = this.add.image(this.scale.width / 2, 404, 'mountains').setDepth(0); // Add mtns

        this.ocean = this.add.image(this.scale.width / 2, 594, 'ocean').setTint(0x76bed8).setDepth(0);

        // this.dock = this.add.image(125, this.scale.height - 55, 'dock').setDepth(5);

        this.boat = this.add.image(2 * this.scale.width / 3, this.scale.height - 55, 'boat').setDepth(5);

        this.splashArray = [];
        for (let i=0; i<64; i++) {
            let x = Phaser.Math.Between(this.scale.width / 3, this.scale.width); // Phaser.Math.Between(0, this.scale.width);
            let y = Phaser.Math.Between(this.scale.height - (this.ocean.height / 2), this.scale.height);
            this.splashArray.push(this.add.sprite(x, y, 'splash'));
        }

        this.barrierOffset = 50;
        this.barriers = this.physics.add.staticGroup();
        // this.barriers.create(125, 760 - this.barrierOffset, 'barrier')
        //     .setScale(10, 1)
        //     .refreshBody();
        this.barriers.create(2 * this.scale.width / 3 - 30, 760 - this.barrierOffset, 'barrier')
            .setScale(26, 1)
            .refreshBody();

        this.flowerpad = this.add.image(30, this.scale.height - this.barrierOffset - 55, 'lilypad-flower');
        this.barriers.create(this.flowerpad.x, 760 - this.barrierOffset, 'barrier')
            .setScale(6, 1)
            .refreshBody();

        this.rock = this.add.sprite(this.scale.width / 4, this.scale.height - 55, 'rock');
        this.rockLive = true;
        this.rockBarrier = this.physics.add.staticImage(this.rock.x, 760 - this.barrierOffset, 'barrier')
            .setScale(6, 1)
            .refreshBody();

        this.timo = this.physics.add.staticSprite(3 * this.scale.width / 4, this.y, 'timo', 1).setDepth(5);
        this.timoLive = true;

        this.message = this.add.sprite(2 * this.scale.width / 3 - 24, 3 * this.scale.height / 4 - 24, 'message').setAlpha(0).setDepth(15);
        this.playMessage = false;

        this.spawnPlayer(this.x, this.y);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.activeKeys = {
            left: false,
            right: false
        }

        this.disabledControls = {
            left: false,
            right: false,
            up: false
        };

        this.nextScene = {
            key: 'nextScene',
            player: {
                x: 0,
                y: this.scale.height - this.barriers.getChildren()[0].height - this.barrierOffset - (this.player.height / 2)
            }
        }

        // this.physics.add.collider(this.player, this.barriers, () => {
        //     console.log('works!!!');
        //     // this.time.delayedCall(1000, this.rock.anims.play('rockSink', true));
        // });

        // this.spawnPlayer(300, 450);
        
        // EventBus.on('createPlayerObject', (x, y) => {
        //     // this.loc = {
        //         this.x = x,
        //         this.y = y
        //     // }
        // })

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

        if (this.rocket != null && this.rocket.y < this.scale.height / 5) {
            this.rocket.body.setAllowGravity(false).setVelocity(0, 0);
            this.rocket.setAlpha(0);
            // console.log("inloop:",this.rocket.x, this.rocket.y)
        }
        // console.log(this.rocket.x, this.rocket.y)

        this.splashArray[Phaser.Math.Between(0, 42)].anims.play('splashAnim', true);
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
                this.nextScene.key = 'PlatformScene';

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

        if (this.cursors.up.isDown && this.player.body.touching.down && !this.disabledControls.up)
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
        this.physics.add.collider(this.player, this.rockBarrier, () => {
            if (this.rockLive) {
                this.rock.anims.playAfterDelay('rockSink', 1000);
                this.time.delayedCall(1000, () => { this.rockBarrier.body.checkCollision.none = true; });
                this.rock.anims.playAfterDelay('rockRise', 3000);
                this.time.delayedCall(3500, () => { this.rockBarrier.body.checkCollision.none = false; });
                this.time.delayedCall(4000, () => { this.rockLive = true });
                this.rockLive = false;
            }
        });
        this.physics.add.collider(this.player, this.timo, () => {
            if (this.timoLive) {
                // console.log('collision!')

                this.player.setBounce(0);
                this.timo.setBounce(0);
                this.timo.setFrame(0);

                this.timo.body.checkCollision.none = true;
                this.disableKeyboard();
                this.playEnding();
                this.timoLive = false;
            }
        })

        // this.movePlayerInputs();
    }

    disableKeyboard ()
    {
        this.disabledControls.left = true;
        this.disabledControls.right = true;
        // this.time.delayedCall(20, () => this.disabledControls.up = true);
        // this.input.keyboard.enabled = false;
    }

    createFireworks ()
    {
        this.colors = [0xff0000, 0xff8000, 0xffff00, 0x00ff00, 0x0000ff, 0x800080, 0xffffff];

        this.fireworksCollection = []

        this.promFireworkCollection = []
        
        // this.rocketsCollection = []
        for (let i=0; i<10; i++) {
            let x = Phaser.Math.Between(50, this.scale.width - 50);
            let y = Phaser.Math.Between(50, this.scale.height / 5);
            // this.rocketsCollection.push(this.physics.add.image(x, y - 300, 'rocket')
            //     .setScale(0.1)
            //     .setDepth(-5)
            //     .setAlpha(0)
            // );
            this.fireworksCollection.push(this.add.sprite(x, y, 'fireworks', 46).setTint(this.colors[Phaser.Math.Between(0, this.colors.length)]));
        }
        
    }

    playEnding ()
    {
        //  Change to night
        this.tweens.add({
            targets: [this.bg], 
            alpha: 0.4,
            duration: 2000,
            onComplete: () => {
                this.tweens.add({
                    targets: [this.sunset, this.bg, this.sunsetPurp, ...this.splashArray],
                    alpha: 0,
                    duration: 2000,
                });
            }
        });
        this.time.delayedCall(1600, () => {
            this.tweens.add({
                targets: [this.mtns, this.ocean, this.rock, this.flowerpad, this.sunsetPurp], 
                alpha: 0.4,
                duration: 1800
            });
            this.tweens.add({
                targets: [this.boat], 
                alpha: 0.8,
                duration: 1800
            });
        });
        

        //speech bubble
        this.time.delayedCall(5500, () => {
            this.timo.setFrame(2);
        })
        this.time.delayedCall(6000, () => {
            this.message.setAlpha(1);
        });
        this.time.delayedCall(6500, () => {
            this.message.anims.play('playMessage', true);
        });

        //fireworks
        this.time.delayedCall(11000, () => {
            
            this.time.delayedCall(1000, () => {
                this.prom = this.add.image(400, 300, 'prom').setScale(0.2).setAlpha(0);
                // this.promEmitter = this.add.particles(400, 300, 'prom', {
                //     speed: { min: -400, max: 400 },
                //     angle: { min: 0, max: 360 },
                //     scale: { start: 0.05, end: 0 },
                //     lifespan: 4000,
                //     blendMode: 'ADD',
                //     gravityY: 600
                // });

                // this.promEmitter.explode(50, 400, 300);

                let pieces = []
                // let width = this.prom.width / 10;
                // let height = this.prom.height / 10;
                let dimension = Phaser.Math.Between(5, 15);
                for (let i=0; i<this.prom.width; i+=10) {
                    for (let j=0; j<this.prom.height; j+=10) {
                        let cropX = i;
                        let cropY = j;

                        let piece = this.add.image(256 + cropX * 2 / 5, 80 + cropY * 2 / 5, 'prom')
                            .setCrop(cropX, cropY, dimension, dimension)
                            .setScale(0.4)
                        
                        
                            // .setOrigin(0,0);

                        this.physics.add.existing(piece);

                        let offset = Phaser.Math.Between(-20, 20);
                        piece.body.setAllowGravity(false);
                        piece.body.setVelocity((cropX - this.prom.width / 2 + offset)/5, (cropY - this.prom.height / 2 + offset)/5);
                        piece.body.setAcceleration((this.prom.width / 2 - cropX)/10, (this.prom.height / 2 - cropY)/10);
                        pieces.push(piece)
                    }
                }

                pieces.forEach(piece => {
                //     piece.body.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-650, -700));
                    this.time.delayedCall(1000, () => {
                        piece.body.setAcceleration(0, 0);
                //         piece.body.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
                //         piece.body.setAllowGravity(false);
                    });
                    this.time.delayedCall(Phaser.Math.Between(4900, 5100), () => piece.destroy());
                //     // piece.body.setAngularVelocity(Phaser.Math.Between(0, 360));
                });
            });


            this.rocket = this.physics.add.image(this.scale.width / 2, this.scale.height / 4 + 300, 'rocket').setScale(0.2).setDepth(20).setAlpha(1).setVelocityY(-1000);
            // this.rocket.body.setAllowGravity(false);
            // this.rocket.body.setAllowGravity(true).;
            // this.rocket.setY(this.scale.height / 4 - 300).setAlpha(1);
            for (let i=0; i<this.fireworksCollection.length; i++) {
                let delay = Phaser.Math.Between(4000, 10000);
                let firework = this.fireworksCollection[i];
                
                // this.time.delayedCall(delay, () => {
                //     this.rocketsCollection[i]
                //         .setX(firework.x)
                //         .setY(firework.y - 300)
                //         .setAlpha(1)
                //         .setVelocityY(-1000)
                //         .refreshBody();
                //     this.time.delayedCall(1000, () => {
                //         this.rocketsCollection[i].setAlpha(0);
                //     });
                // });

                firework.anims.playAfterDelay({
                    key: 'playFireworks',
                    // startFrame: 18,
                    repeat: -1,
                    repeatDelay: 2000
                }, delay)


            }
        });
        // this.fireworks.anims.playAfterDelay({
        //     key: 'playFireworks',
        //     // startFrame: 18,
        //     repeat: -1,
        //     repeatDelay: 2000
        // }, 8000);
        // this.fireworks.stopOnFrame(this.fireworks.anims.currentAnim.getFrameAt(17));
        // this.time.delayedCall(10250, () => {
        //     this.fireworks.setAlpha(0);
        // })
    }

    changeScene ()
    {
        this.scene.start(this.nextScene.key, {
            player: {
                x: this.nextScene.player.x,
                y: this.nextScene.player.y,
            }
        });
    }
}