import { Engine, Actor, Color, Vector, Rectangle, Timer, DisplayMode } from 'excalibur';

// 1. Inisialisasi Engine
const game = new Engine({
    displayMode: DisplayMode.FillScreen, // <-- Kunci untuk membuat canvas full web
    backgroundColor: Color.Black
});

document.body.appendChild(game.canvas);

// Ambil referensi elemen DOM dari HTML
const uiCounter = document.getElementById('ui-counter');

// 2. Eksekusi Benchmark
game.start().then(() => {
    let totalObjectSpawned = 0;
    const SPAWN_COUNT = 50;
    const SPAWN_INTERVAL_MS = 200;

    const benchmarkTimer = new Timer({
        fcn: () => {
            const currentFps = game.stats.currFrame.fps;

            for (let i = 0; i < SPAWN_COUNT; i++) {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                
                const kotakVisual = new Rectangle({
                    width: 100,
                    height: 100,
                    color: new Color(r, g, b)
                });

                const aktorKotak = new Actor({
                    pos: new Vector(Math.random() * game.drawWidth, Math.random() * game.drawHeight),
                    width: 100,
                    height: 100
                });

                aktorKotak.graphics.use(kotakVisual);
                game.currentScene.add(aktorKotak);

                totalObjectSpawned++;
            }

            // Update Teks di UI HTML setiap kali spawn
            uiCounter.innerText = totalObjectSpawned;
        },
        interval: SPAWN_INTERVAL_MS,
        repeats: true
    });

    game.currentScene.add(benchmarkTimer);
    benchmarkTimer.start();
});