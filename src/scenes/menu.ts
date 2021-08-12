import Phaser from 'phaser';
import {
    WIDTH,
    HEIGHT,
    FONT
} from '../defaults';
import { createStars, updateStars } from '../shared';

export default class Menu extends Phaser.Scene {
    title: Phaser.GameObjects.Text;
    start_text: Phaser.GameObjects.Text;
    // stars: [Phaser.GameObjects.Rectangle];
    stars: Array<Phaser.GameObjects.Rectangle>;

    constructor() {
        super('Menu');
    }

    preload() {

    }

    create() {
        this.stars = createStars(this, WIDTH, HEIGHT);

        this.title = this.add.text(WIDTH / 2, HEIGHT / 2 - 100, 'Starship', {
            fontSize: '32px',
            fontFamily: FONT,
            color: 'red',
        }).setOrigin(.5);

        this.start_text = this.add.text(WIDTH / 2, HEIGHT / 2, 'Start', {
            fontSize: '24px',
            fontFamily: FONT,
            color: 'red',
        }).setOrigin(.5).setInteractive();

        this.start_text.on('pointerover', () => {
            this.start_text.setText('> Start <');
        });

        this.start_text.on('pointerout', () => {
            this.start_text.setText('Start');
        })

        this.start_text.on('pointerdown', () => {
            this.scene.start('Play');
        });
    }

    update() {
        updateStars(WIDTH, HEIGHT, this.stars);
    }
}