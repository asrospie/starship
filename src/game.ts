import Phaser from 'phaser';
import Menu from './scenes/menu';
import Play from './scenes/play';
import {
    WIDTH,
    HEIGHT
} from './defaults';

const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        }
    },
    scene: [Menu, Play],
    // scene: Play,
}
let game = new Phaser.Game(config);