import { Boot } from './scenes/Boot';
import { MenuOverlay } from './scenes/MenuOverlay';
import { TitleEmma } from './scenes/TitleEmma';
import { TitleTimo } from './scenes/TitleTimo';
import { PlatformScene } from './scenes/PlatformScene';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    scene: [
        Boot,
        Preloader,
        TitleEmma,
        MenuOverlay,
        PlatformScene,
        TitleTimo,
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1400 },
            debug: false
        }
    }
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
