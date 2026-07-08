import Phaser from 'phaser';

const TOTAL_SPAWN = 5000;
const actorsList = [];
const assetKeys = ['assetA', 'assetB', 'assetC'];

class BenchmarkScene extends Phaser.Scene {
    constructor() {
        super('BenchmarkScene');
    }

    // 1. Fase Preload: Memuat dan langsung memotong Sprite Sheet
    preload() {
        // Konfigurasi pemotongan otomatis oleh Phaser (frame 32x32)
        const frameConfig = { frameWidth: 32, frameHeight: 32 };

        // Pastikan path gambar sesuai dengan direktori Anda
        this.load.spritesheet('assetA', '/Asset/AssetA.png', frameConfig);
        this.load.spritesheet('assetB', '/Asset/AssetB.png', frameConfig);
        this.load.spritesheet('assetC', '/Asset/AssetC.png', frameConfig);
    }

    // 2. Fase Create: Eksekusi setelah semua aset siap
    create() {
        // ========================================================
        // 1. SPAWN 2000 ENTITY SEKALIGUS DI AWAL
        // ========================================================
        for (let i = 0; i < TOTAL_SPAWN; i++) {
            const randomX = Math.random() * 1920;
            const randomY = Math.random() * 1080;
            
            const randomKey = assetKeys[Math.floor(Math.random() * assetKeys.length)];
            const randomFrame = Math.floor(Math.random() * 12); // Indeks 0 - 11

            // Spawn sprite menggunakan Phaser API
            const sprite = this.add.sprite(randomX, randomY, randomKey, randomFrame);

            // Regangkan ukuran render sprite dari 32x32 menjadi 100x100
            sprite.setDisplaySize(100, 100);

            actorsList.push(sprite);
        }

        console.log(`${TOTAL_SPAWN} sprites spawned. Cooldown 5s started...`);

        // ========================================================
        // 2. TIMING COOLDOWN 5 DETIK (5000ms)
        // ========================================================
        this.time.delayedCall(5000, () => {
            console.log("Cooldown finished. Mutating Asset ID & Source X every 200ms...");
            this.startBenchmarkLoop();
        });
    }

    // ========================================================
    // 3. LOGIKA ON TICK (LOOP BENCHMARK PER 200ms)
    // ========================================================
    startBenchmarkLoop() {
        // Gunakan Time Event bawaan Phaser agar sinkron dengan siklus rendering utama
        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                // Loop seluruh list sprite dan ubah tekstur serta pose-nya
                for (let i = 0; i < actorsList.length; i++) {
                    const sprite = actorsList[i];
                    
                    const randomKey = assetKeys[Math.floor(Math.random() * assetKeys.length)];
                    const randomFrame = Math.floor(Math.random() * 12);

                    // Di Phaser, setTexture mengganti Asset ID (texture) sekaligus Source X (frame)
                    // Sangat efisien karena meng-update pointer WebGL di belakang layar
                    sprite.setTexture(randomKey, randomFrame);
                }
            }
        });
    }
}

// ========================================================
// INISIALISASI ENGINE PHASER
// ========================================================
const config = {
    type: Phaser.WEBGL, // Paksa gunakan WebGL untuk perbandingan head-to-head
    width: 1920,
    height: 1080,
    backgroundColor: '#1a1a1a',
    pixelArt: true, // WAJIB: Mematikan antialiasing untuk efek Pixel Perfect / Linear Mode
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: BenchmarkScene
};

const game = new Phaser.Game(config);