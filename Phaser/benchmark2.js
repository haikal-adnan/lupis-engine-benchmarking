import Phaser from 'phaser';

class BenchmarkScene extends Phaser.Scene {
    constructor() {
        super('BenchmarkScene');
        // List untuk menyimpan referensi 2000 objek rectangle agar mudah di-iterate
        this.rectangles = []; 
        this.spawnCount = 10000;
    }

    preload() {
        // Tidak memerlukan eksternal aset gambar
    }

    create() {
        // Container utama untuk menampung semua objek rectangle
        this.boxContainer = this.add.container(0, 0);

        this.spawnAllRectangles();

        // ==========================================
        // 3. COOLDOWN 5 DETIK SEBELUM UPDATE TICK
        // ==========================================
        this.time.delayedCall(5000, () => {
            this.startBenchmarkLoop();
        });
    }

    spawnAllRectangles() {
        for (let i = 0; i < this.spawnCount; i++) {
            const randomX = Phaser.Math.Between(0, 1920);
            const randomY = Phaser.Math.Between(0, 1080);
            const randomColor = Phaser.Math.Between(0, 0xFFFFFF);

            // Menggunakan objek Rectangle (lebih optimal untuk update data real-time)
            const rect = this.add.rectangle(randomX, randomY, 100, 100, randomColor);
            
            // Masukkan ke dalam container utama
            this.boxContainer.add(rect);

            // Simpan referensi ke array untuk proses loop data nanti
            this.rectangles.push(rect);
        }
        console.log(`${this.spawnCount} entities spawned. Cooldown 5s started...`);
    }

    startBenchmarkLoop() {
        console.log("Cooldown finished. Mutating entity data every 200ms...");

        // Menggunakan Phaser Time Event dengan delay 200ms untuk memanipulasi data entity
        this.time.addEvent({
            delay: 200,
            callback: this.mutateRectangles,
            callbackScope: this,
            loop: true
        });
    }

    mutateRectangles() {
        // Melakukan for-each ke seluruh data entity yang telah di-spawn
        this.rectangles.forEach((rect) => {
            const nextX = Phaser.Math.Between(0, 1920);
            const nextY = Phaser.Math.Between(0, 1080);
            const nextColor = Phaser.Math.Between(0, 0xFFFFFF);

            // Mengubah koordinat lokasi entity
            rect.setPosition(nextX, nextY);
            
            // Mengubah warna hexadecimal entity
            rect.setFillStyle(nextColor);
        });
    }

    update(time, delta) {
        // Game loop frame-by-frame dikosongkan karena benchmark berfokus pada tick 200ms
    }
}

// Konfigurasi dasar Game Phaser (Disetel ke 1920x1080)
const config = {
    type: Phaser.WEBGL, 
    width: 1920,
    height: 1080,
    backgroundColor: '#1a1a1a',
    parent: 'game-container',
    scene: [BenchmarkScene]
};

const game = new Phaser.Game(config);