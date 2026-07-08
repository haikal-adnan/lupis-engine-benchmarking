import { Engine, Actor, Color, Vector, Timer, DisplayMode, ImageSource, SpriteSheet, Loader } from 'excalibur';

const TOTAL_SPAWN = 5000;
const actorsList = [];

// Array global untuk menyimpan kumpulan potongan SpriteSheet hasil loading
let globalSpriteSheets = [];

// 1. Inisialisasi Engine dengan Pixel Perfect (antialiasing: false)
const game = new Engine({
    displayMode: DisplayMode.FillScreen,
    backgroundColor: Color.fromHex('#1a1a1a'),
    antialiasing: false // Menonaktifkan linear smoothing untuk Pixel Perfect
});

if (!game.canvas.parentElement) {
    document.body.appendChild(game.canvas);
}

const uiCounter = document.getElementById('ui-counter');

// 2. Siapkan Sumber Gambar Aset sesuai direktori Anda
const imageA = new ImageSource('/Asset/AssetA.png'); 
const imageB = new ImageSource('/Asset/AssetB.png'); 
const imageC = new ImageSource('/Asset/AssetC.png'); 

const loader = new Loader([imageA, imageB, imageC]);

// Menghapus Tombol "Play game" & Logo Secara Total (Auto-play setelah loading)
loader.playButtonText = '';        
loader.suppressPlayButton = true;   

// Helper function untuk mengambil satu frame sprite acak dari salah satu dari 3 asset sheet
// Dan langsung mengunci ukuran peregangan rendering-nya ke 100x100
function getRandomAssetSprite() {
    const randomSheet = globalSpriteSheets[Math.floor(Math.random() * globalSpriteSheets.length)];
    const randomFrame = Math.floor(Math.random() * 12); // Pose/Frame 0 sampai 11
    
    const sprite = randomSheet.sprites[randomFrame];
    
    // Set Target Peregangan Rendering dari Source 32x32 menjadi Tampilan 100x100
    sprite.destSize.width = 100;
    sprite.destSize.height = 100;
    
    return sprite;
}

// 3. Eksekusi Game setelah Loader Selesai Memuat Gambar
game.start(loader).then(() => {
    
    // Konfigurasi pemotongan Grid SpriteSheet (1 Baris, 12 Kolom, Tiap Kotak Asli 32x32)
    const gridConfig = {
        rows: 1,
        columns: 12,
        spriteWidth: 32,
        spriteHeight: 32
    };

    // Daftarkan hasil potongan tekstur ke array global
    globalSpriteSheets = [
        SpriteSheet.fromImageSource({ image: imageA, grid: gridConfig }),
        SpriteSheet.fromImageSource({ image: imageB, grid: gridConfig }),
        SpriteSheet.fromImageSource({ image: imageC, grid: gridConfig })
    ];

    // ========================================================
    // 1. SPAWN 2000 ENTITY (ACTOR) SEKALIGUS DI LOKASI ACAK
    // ========================================================
    for (let i = 0; i < TOTAL_SPAWN; i++) {
        // Generate Actor dengan base ukuran benchmark 100x100 di lokasi acak (0-1920, 0-1080)
        const aktorKotak = new Actor({
            pos: new Vector(Math.random() * 1920, Math.random() * 1080),
            width: 100,
            height: 100
        });

        // Ambil potongan sprite acak (Mengatur Texture Asset ID dan Source X awal)
        const assetVisual = getRandomAssetSprite();

        // Pasangkan grafis sprite ke actor
        aktorKotak.graphics.use(assetVisual);
        
        game.currentScene.add(aktorKotak);
        
        // Simpan id / referensi objek ke dalam list array
        actorsList.push(aktorKotak);
    }

    if (uiCounter) {
        uiCounter.innerText = TOTAL_SPAWN.toLocaleString();
    }
    console.log(`${TOTAL_SPAWN} actors spawned. Cooldown 5s started...`);

    // ========================================================
    // 2. TIMING COOLDOWN 5 DETIK (5000ms)
    // ========================================================
    const cooldownTimer = new Timer({
        interval: 5000,
        repeats: false,
        fcn: () => {
            console.log("Cooldown finished. Mutating Asset ID & Source X only every 200ms...");
            startBenchmarkLoop();
        }
    });

    game.currentScene.add(cooldownTimer);
    cooldownTimer.start();
});

// ========================================================
// 3. LOGIKA ON TICK (LOOP BENCHMARK PER 200ms)
// ========================================================
function startBenchmarkLoop() {
    const mutationTimer = new Timer({
        interval: 200,
        repeats: true,
        fcn: () => {
            // Lakukan looping pada kumpulan entitas yang telah disimpan di list
            actorsList.forEach((aktor) => {
                // POSISI TETAP (TIDAK DIUBAH)
                
                // Murni Mutasi Manajemen Aset (Mengacak ulang Asset ID & Source X saja)
                const nextAssetVisual = getRandomAssetSprite();
                aktor.graphics.use(nextAssetVisual);
            });
        }
    });

    game.currentScene.add(mutationTimer);
    mutationTimer.start();
}