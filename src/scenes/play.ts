import Phaser from 'phaser';
import {
    HEIGHT,
    WIDTH,
    FONT
} from '../defaults';
import { createStars, updateStars } from '../shared';

export default class Play extends Phaser.Scene {
    stars: Array<Phaser.GameObjects.Rectangle>;
    player: Phaser.GameObjects.Triangle;
    cursors: any;
    bullets: Phaser.Physics.Arcade.Group;
    last_fired: number = 0;
    shot_wait_time: number = 400;
    player_velocity: number = 300;

    constructor() {
        super('Play');
    }

    preload() {

    }

    createPlayer() {
        this.player =  this.add.triangle(
            WIDTH / 2,
            HEIGHT - 100,
            0, 32,      // first point
            16, 0,      // second point
            32, 32,     // third point
            0xff0000
        );

        this.physics.add.existing(this.player);
    }

    create() {
        this.stars = createStars(this, WIDTH, HEIGHT);

        this.createPlayer();

        this.cursors = this.input.keyboard.addKeys({
            left: 'A',
            right: 'D',
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.bullets = this.physics.add.group();
    }

    update(time: number) {
        updateStars(WIDTH, HEIGHT, this.stars);

        // handle user input
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -1 * this.player_velocity;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.player_velocity;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursors.space.isDown && time > this.last_fired) {
            this.createBullet();
            this.last_fired = time + this.shot_wait_time;
        }

        this.bullets.children.iterate(bullet => {
            if (bullet.body.velocity.y === 0) {
                bullet.body.velocity.y = -400;
            }
        }); 
    }

    createBullet() {
        let x = this.player.body.position.x + this.player.width / 2;
        let y = this.player.body.position.y - 20;
        let bullet = this.add.rectangle(x, y, 10, 40, 0xfff);
        this.bullets.add(bullet);
    }
}