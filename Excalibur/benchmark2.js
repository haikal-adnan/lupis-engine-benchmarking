import { Engine, Actor, Color, Vector, Rectangle, Timer, DisplayMode } from 'excalibur';

// 1. Inisialisasi Engine
const game = new Engine({
    displayMode: DisplayMode.FillScreen,
    backgroundColor: Color.fromHex('#1a1a1a')
});

// Pastikan canvas masuk ke DOM (Excalibur otomatis memasukkannya jika tidak di-append manual, 
// namun baris ini aman dipertahankan tergantung setup boilerplate Anda)
if (!game.canvas.parentElement) {
    document.body.appendChild(game.canvas);
}

// Ambil referensi elemen DOM dari HTML untuk UI Counter
const uiCounter = document.getElementById('ui-counter');

// List untuk menyimpan referensi Actor yang di-spawn agar bisa dimutasi datanya nanti
const actorsList = [];
const TOTAL_SPAWN = 10000;

// Helper function untuk generate warna acak di Excalibur
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return new Color(r, g, b);
}

// 2. Eksekusi Game
game.start().then(() => {
    
    // ==========================================
    // 1. SPAWN 2000 ENTITY (ACTOR) SEKALIGUS DI AWAL
    // ==========================================
    for (let i = 0; i < TOTAL_SPAWN; i++) {
        // Generate komponen visual bentuk kotak
        const kotakVisual = new Rectangle({
            width: 100,
            height: 100,
            color: getRandomColor()
        });

        // Generate Actor (Entity di Excalibur)
        const aktorKotak = new Actor({
            pos: new Vector(Math.random() * game.drawWidth, Math.random() * game.drawHeight),
            width: 100,
            height: 100
        });

        // Pasangkan grafik ke actor
        aktorKotak.graphics.use(kotakVisual);
        
        // Daftarkan actor ke scene aktif
        game.currentScene.add(aktorKotak);

        // Simpan referensi ke array untuk di-loop saat tick
        actorsList.push(aktorKotak);
    }

    // Set UI teks langsung ke angka total target pengujian
    if (uiCounter) {
        uiCounter.innerText = TOTAL_SPAWN.toLocaleString();
    }
    console.log(`${TOTAL_SPAWN} actors spawned. Cooldown 5s started...`);

    // ==========================================
    // 2. TIMING COOLDOWN 5 DETIK (5000ms)
    // ==========================================
    const cooldownTimer = new Timer({
        interval: 5000,
        repeats: false,
        fcn: () => {
            console.log("Cooldown finished. Mutating Excalibur actors data every 200ms...");
            // Jalankan looping update setelah cooldown selesai
            startBenchmarkLoop();
        }
    });

    game.currentScene.add(cooldownTimer);
    cooldownTimer.start();
});

// ==========================================
// 3. LOGIKA ON TICK UNTUK MANIPULASI DATA
// ==========================================
function startBenchmarkLoop() {
    const mutationTimer = new Timer({
        interval: 200,
        repeats: true,
        fcn: () => {
            // Lakukan forEach ke seluruh Actor yang disimpan dalam list
            actorsList.forEach((aktor) => {
                // 1. Mutasi data Posisi Actor
                const nextX = Math.random() * game.drawWidth;
                const nextY = Math.random() * game.drawHeight;
                aktor.pos.setTo(nextX, nextY);

                // 2. Mutasi data Warna Grafik Actor
                // Ambil grafik aktif saat ini (Rectangle) yang berada di dalam graphics feature
                const currentGraphic = aktor.graphics.current;
                if (currentGraphic) {
                    currentGraphic.color = getRandomColor();
                }
            });
        }
    });

    game.currentScene.add(mutationTimer);
    mutationTimer.start();
}