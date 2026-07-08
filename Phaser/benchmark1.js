import Phaser from 'phaser';

class BenchmarkScene extends Phaser.Scene {
    constructor() {
        super('BenchmarkScene');
        this.totalObjects = 0;
    }

    preload() {
        // Kita tidak memerlukan eksternal aset gambar karena menggunakan Phaser Graphics
    }

    create() {
        // Container utama untuk menampung semua objek rectangle benchmark
        this.boxContainer = this.add.container(0, 0);

        // ==========================================
        // 1. MEMBUAT UI COUNTER (Pojok Kiri Atas)
        // ==========================================
        // Di Phaser, kita bisa menggambar background hitam menggunakan Graphics
        const uiBg = this.add.graphics();
        uiBg.fillStyle(0x000000, 0.8); // Hitam dengan opacity 80%
        uiBg.fillRect(10, 10, 220, 50);
        
        // Membuat teks counter
        this.countText = this.add.text(25, 25, 'Objects: 0', {
            fontFamily: 'Arial',
            fontSize: '16px',
            fill: '#ffffff',
            fontWeight: 'bold'
        });

        // Memastikan UI selalu berada di lapisan paling depan (Depth tinggi)
        uiBg.setDepth(9999);
        this.countText.setDepth(9999);

        // ==========================================
        // 2. TIMING COOLDOWN (200ms)
        // ==========================================
        // Menggunakan Phaser Time Event sebagai pengganti setInterval bawaan browser
        this.time.addEvent({
            delay: 200,
            callback: this.spawnBatch,
            callbackScope: this,
            loop: true
        });
    }

    spawnBatch() {
        const batchSize = 50;

        for (let i = 0; i < batchSize; i++) {
            // Generate koordinat acak (X: 0-1920, Y: 0-1080)
            const randomX = Phaser.Math.Between(0, 1920);
            const randomY = Phaser.Math.Between(0, 1080);
            
            // Generate warna hexadecimal acak
            const randomColor = Phaser.Math.Between(0, 0xFFFFFF);

            // Membuat objek Graphics baru untuk Rectangle 100x100
            const rect = this.add.graphics();
            rect.fillStyle(randomColor, 1);
            rect.fillRect(0, 0, 100, 100);
            
            // Atur posisi objek
            rect.setPosition(randomX, randomY);

            // Masukkan ke dalam container utama
            this.boxContainer.add(rect);
        }

        // Update total hitungan objek dan perbarui UI text
        this.totalObjects += batchSize;
        this.countText.setText(`Objects: ${this.totalObjects.toLocaleString()}`);
    }

    update(time, delta) {
        // Game loop berjalan di sini jika kamu ingin menambahkan logika per frame nanti
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