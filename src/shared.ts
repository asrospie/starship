import Phaser from 'phaser';

export function updateStars(w: number, h: number, stars: Array<Phaser.GameObjects.Rectangle>) {
    stars.forEach(star => {
        if (star.y + 1 >= h) {
            star.setX(Math.floor(Math.random() * w));
            star.setY(0);
        } 
        else {
            star.setY(star.y + 1);
        }
    });
}

export function createStars(game: any, w: number, h: number): Array<Phaser.GameObjects.Rectangle> {
    let stars = Array<Phaser.GameObjects.Rectangle>();
    for (let i = 0; i < 200; i++) {
        let x = Math.floor(Math.random() * w);
        let y = Math.floor(Math.random() * h);
        let color = 0xffffff;
        stars.push(game.add.rectangle(x, y, 5, 5, color));
    }
    return stars;
}