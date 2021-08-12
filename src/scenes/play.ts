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
    enemies: Phaser.Physics.Arcade.Group;
    last_fired: number = 0;
    shot_wait_time: number = 400;
    player_velocity: number = 300;
    enemy_spawn_rate: number = 2000;
    last_enemy_spawned: number = 0;
    score: number = 0;
    score_text: Phaser.GameObjects.Text;
    lives_left: number = 3;
    lives_left_text: Phaser.GameObjects.Text;
    enemy_velocity: number = 100;
    game_over_text: Phaser.GameObjects.Text;
    game_over: boolean = false;

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
        // @ts-ignore
        this.player.body.setCollideWorldBounds(true);
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
        this.enemies = this.physics.add.group();

        this.physics.add.collider(this.bullets, this.enemies, this.shootEnemy, undefined, this);
        this.physics.add.collider(this.player, this.enemies, this.playerHit, undefined, this);

        // Game text
        this.score_text = this.add.text(20, 20, `Score: ${this.score}`, {
            fontSize: '18px',
            fontFamily: FONT,
            color: 'red',
        });       

        this.lives_left_text = this.add.text(20, 60, `Lives: ${this.lives_left}`, {
            fontSize: '18px',
            fontFamily: FONT,
            color: 'red',
        });

        this.game_over_text = this.add.text(WIDTH / 2, HEIGHT / 2, 'GAME OVER', {
            fontSize: '128px',
            fontFamily: FONT,
            color: 'red',
        }).setOrigin(.5).setVisible(false);

        this.score_text.depth = 100;
        this.lives_left_text.depth = 100;
        this.game_over_text.depth = 100;
    }

    shootEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.score += 10;
        this.score_text.setText(`Score: ${this.score}`);
    }

    playerHit(player, enemy) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
        this.lives_left--;
        this.lives_left_text.setText(`Lives: ${this.lives_left}`);
        if (this.lives_left === 2) {
            player.setActive(false);
            player.setVisible(false);
            this.game_over_text.setVisible(true);
            this.enemies.setVisible(false);
            this.enemies.setActive(false);
            this.game_over = true;
        }
        enemy.destroy();
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

        if (!this.game_over && time > this.last_enemy_spawned) {
            this.createEnemy();
            this.last_enemy_spawned = time + this.enemy_spawn_rate;
        }

        if (!this.game_over) {
            this.bullets.children.iterate(bullet => {
                if (bullet.body.velocity.y === 0) {
                    bullet.body.velocity.y = -400;
                }
            }); 
        }

        if (this.game_over && this.cursors.space.isDown) {
            this.scene.start('Menu');
        }
    }

    createBullet() {
        let x = this.player.body.position.x + this.player.width / 2;
        let y = this.player.body.position.y - 20;
        let bullet = this.add.rectangle(x, y, 10, 40, 0xfff);
        this.physics.add.existing(bullet);
        this.bullets.add(bullet);
        this.bullets.children.iterate(b => {
            if (b === bullet) {
                // @ts-ignore
                b.body.setCollideWorldBounds(true);
                // @ts-ignore
                b.body.onWorldBounds = true;
                // @ts-ignore
                b.body.world.on('worldbounds', body => {
                    if (body === b.body) {
                        b.destroy();
                    }
                }, b);
            }
        });
    }

    createEnemy() {
        let x = Math.floor(Math.random() * WIDTH);
        let y = 20;

        let enemy = this.add.circle(x, y, 20, 0x00ff00);

        this.enemies.add(enemy);
        this.enemies.children.iterate(e => {
            if (e === enemy) {
                e.body.velocity.y = this.enemy_velocity;

                // @ts-ignore
                e.body.setCollideWorldBounds(true);
                // @ts-ignore
                e.body.onWorldBounds = true;
                // @ts-ignore
                e.body.world.on('worldbounds', body => {
                    if (body === e.body) {
                        e.destroy();
                    }
                });
            }
        });
    }
}