# Laporan Pengujian Komparatif & Benchmark Engine

## 1. Ringkasan Eksekutif & Lingkungan Uji
Dokumen ini mencatat hasil pengujian performa secara objektif antara **Lupis Engine** dengan beberapa *engine* pembanding standar industri pada skenario beban kerja tertentu.

* **Nama Engine Utama:** Lupis Engine
* **Versi / Commit SHA:** `v1.0` 
* **Tanggal Pengujian:** 17 Juni 2026
* **Spesifikasi Perangkat (Uji Runtime):**
  * **OS:** Windows 11 
  * **Browser:** Chrome 149.0.7827.114
  * **CPU:** Intel i5 12400 F
  * **GPU:** NVIDIA RTX 4060 8GB VRAM
  * **RAM:** 16GB DDR4 @ 3200MHz
  * **Monitor:** 144Hz

---

## 2. Target Engine Pembanding
Pengujian komparatif ini melibatkan 4 kandidat *engine* eksternal yang mencakup alur kerja berbasis GUI (Visual Editor) maupun CLI (Code-Only Framework) untuk mendapatkan tolok ukur performa yang menyeluruh:

| Nama Engine | Versi | Alur Kerja (Workflow) | Core / Renderer Tech | Alasan Pemilihan |
| :--- | :---: | :---: | :--- | :--- |
| **Lupis Engine** | `v1.0` | GUI (Visual Editor) | Vue.js + WebGL | Objek utama penelitian yang divalidasi dari aspek arsitektur, fungsionalitas, dan performa. |
| **GDevelop** | `v5.6.272` | GUI (Visual Editor) | JS/C++ Core + PixiJS | Editor visual berbasis event system yang bersifat open-source dan memiliki fitur pengembangan game 2D yang lengkap. |
| **Construct 3** | `r487` | GUI (Visual Editor) | HTML5 + WebGL/WebGPU | Platform pengembangan game berbasis browser yang telah matang dan banyak digunakan dalam industri maupun pendidikan. |
| **Excalibur** | `v0.3.2` | CLI (Code-Only) | TypeScript + WebGL/Canvas | Arsitektur game engine yang terintegrasi dengan pendekatan code-first berbasis TypeScript. |
| **Phaser** | `v4.1.0` | CLI (Code-Only) | JavaScript + WebGL/Canvas | Framework game 2D berbasis JavaScript yang memiliki komunitas besar, dokumentasi luas, dan penggunaan yang tinggi pada pengembangan game web. |

---

## 3. Metrik & Metodologi Pengujian

Setiap *engine* diuji pada lingkungan pengujian yang identik (*clean environment*) menggunakan skenario dan jumlah objek yang sama. Pengukuran performa dilakukan menggunakan **FPS & Performance Extension** yang dikembangkan oleh Nova Byte Technologies. Metrik yang digunakan dalam penelitian ini meliputi:

1. **Frames Per Second (FPS)**  
   Menunjukkan jumlah *frame* yang berhasil dirender setiap detik. Nilai FPS digunakan sebagai indikator utama untuk mengukur kelancaran proses rendering dan eksekusi sistem selama pengujian berlangsung.

2. **1% Low FPS**  
   Menunjukkan rata-rata FPS terendah pada 1% sampel performa terburuk selama pengujian. Metrik ini digunakan untuk mengidentifikasi kestabilan performa dan mendeteksi terjadinya penurunan kinerja (*stuttering*) yang tidak selalu terlihat dari nilai FPS rata-rata.

3. **JavaScript Heap Usage (JS Heap)**  
   Menunjukkan jumlah memori JavaScript yang dialokasikan oleh *engine* selama proses pengujian. Nilai ini digunakan untuk mengevaluasi efisiensi penggunaan memori dan kemampuan *engine* dalam mengelola objek yang aktif.

4. **Jumlah Objek Aktif (*Active Object Count*)**  
   Menunjukkan jumlah objek yang berhasil dibuat dan ditampilkan pada saat pengukuran dilakukan. Metrik ini digunakan untuk menggambarkan tingkat beban (*workload*) yang sedang diproses oleh *engine* ketika nilai FPS dan penggunaan memori dicatat.

### Metodologi Pengukuran

Pada setiap skenario pengujian, objek akan ditambahkan secara bertahap hingga terjadi penurunan performa yang signifikan. Nilai FPS, 1% Low FPS, JavaScript Heap Usage, dan jumlah objek aktif dicatat pada kondisi pengujian yang sama untuk setiap *engine*. Hasil pengukuran kemudian digunakan sebagai dasar perbandingan efisiensi rendering, stabilitas performa, serta penggunaan memori antar *engine* yang diuji.

---

## 4. Hasil Skenario Pengujian

### Skenario A: Uji Kekuatan Render (Stress-Test Kritis / 2D Rectangle Spawner)

*Metodologi: Objek berupa geometri Rectangle berukuran 100×100 piksel dengan warna acak (diacak hanya sekali saat instansiasi/spawn). Pasokan beban dikunci secara konstan menggunakan node logic_cooldown pada interval 200 ms untuk melahirkan 50 objek sekaligus (laju pertumbuhan konstan: 250 objek per detik). Simulasi dijalankan secara kontinu hingga performa turun di bawah batas kritis 30 FPS. Angka akhir yang dicatat merupakan nilai FPS, jumlah objek aktif, penggunaan memori JavaScript Heap, dan durasi pengujian yang diperoleh tepat sebelum batas kritis tersebut tercapai.*

| Nama Engine | FPS Akhir | Total Object Saat FPS ±30 | JS Heap | Durasi Pengujian Hingga Batas Kritis |
| :--- | :---: | :---: | :---: | :---: |
| **Lupis Engine** | 27 FPS | 17.238 Objek | 291 MB | ~68 Detik |
| **GDevelop** | 28 FPS | 74.800 Objek | 1230 MB | ~275 Detik |
| **Construct 3** | 28 FPS | 107.602 Objek | 4 MB | ~572 Detik |
| **Excalibur** | 26 FPS | 900 Objek | 180 MB | ~6 Detik |
| **Phaser** | 26 FPS | 158.000 Objek | 416 MB | ~708 Detik |
---

### Skenario B: Uji Manajemen Data (Mass Object Update Test)

*Metodologi: Objek berupa geometri Rectangle berukuran 100×100 piksel dengan warna acak. Seluruh objek dibuat sekaligus pada awal permainan (*startup phase*) dengan posisi acak pada rentang koordinat X: 0–1920 dan Y: 0–1080. Setiap objek yang berhasil dibuat akan disimpan referensinya ke dalam sebuah struktur data List. Setelah seluruh objek selesai dibuat, sistem memasuki masa jeda (*cooldown*) selama 5 detik untuk memastikan proses inisialisasi telah selesai. Selanjutnya, setiap 200 ms sistem melakukan iterasi terhadap seluruh objek yang tersimpan pada List dan memperbarui posisi serta warna objek secara acak. Proses pembaruan data ini dijalankan secara kontinu selama 30 detik. Pengujian dilakukan pada empat tingkat beban, yaitu 500, 1.500, 5.000, dan 10.000 objek. Nilai yang dicatat merupakan Average FPS pada 5 detik terakhir pengujian, 1% Low FPS, dan penggunaan JavaScript Heap.*

#### Beban 500 Objek

| Nama Engine | Average FPS (5 Detik Terakhir) | 1% Low FPS | JS Heap |
| :--- | :---: | :---: | :---: |
| **Lupis Engine** | 144 FPS| 141 FPS | 122 MB |
| **GDevelop** | 144 FPS | 141 FPS | 118 MB |
| **Construct 3** | 144 FPS | 141 FPS | 54 MB |
| **Excalibur** | 51 FPS | 29 FPS | 177 MB |
| **Phaser** | 144 FPS | 141 FPS | 75 MB |

#### Beban 1.500 Objek

| Nama Engine | Average FPS (5 Detik Terakhir) | 1% Low FPS | JS Heap |
| :--- | :---: | :---: | :---: |
| **Lupis Engine** | 141 FPS| 72 FPS | 191 MB |
| **GDevelop** | 144 FPS | 141 FPS | 175 MB |
| **Construct 3** | 144 FPS | 141 FPS | 61 MB |
| **Excalibur** | 5 FPS | 3 FPS | 424 MB |
| **Phaser** | 144 FPS | 141 FPS | 52 MB |

#### Beban 5.000 Objek

| Nama Engine | Average FPS (5 Detik Terakhir) | 1% Low FPS | JS Heap |
| :--- | :---: | :---: | :---: |
| **Lupis Engine** | 27 FPS | 5 FPS | 182 MB |
| **GDevelop** | 144 FPS | 141 FPS | 186 MB |
| **Construct 3** | 144 FPS | 141 FPS | 100 MB |
| **Excalibur** | 1 FPS | n/a | 1726 MB |
| **Phaser** | 144 FPS | 141 FPS | 87 MB |

#### Beban 10.000 Objek

| Nama Engine | Average FPS (5 Detik Terakhir) | 1% Low FPS | JS Heap |
| :--- | :---: | :---: | :---: |
| **Lupis Engine** | 3 FPS | 2 FPS | 187 MB |
| **GDevelop** | 144 FPS | 141 FPS | 256 MB |
| **Construct 3** | 140 FPS | 72 FPS | 129 MB |
| **Excalibur** | 1 FPS | n/a | 2600 MB |
| **Phaser** | 144 FPS | 141 FPS | 107 MB |

#### Tujuan Pengujian

Pengujian ini dirancang untuk mengevaluasi kemampuan setiap *engine* dalam mengelola dan memperbarui data objek dalam jumlah besar secara berulang. Berbeda dengan Skenario A yang berfokus pada kemampuan rendering saat jumlah objek terus bertambah, Skenario B menitikberatkan pada efisiensi iterasi data, pencarian referensi objek, pembaruan atribut objek secara massal, serta stabilitas penggunaan memori selama proses manipulasi data berlangsung.

---

### Skenario C: Uji Manajemen Sprite dan Pergantian Asset (Mass Sprite Update Test)

*Metodologi: Pengujian menggunakan tiga buah aset PNG berbentuk sprite sheet dengan ukuran 384×32 piksel dan ukuran dasar frame 32×32 piksel, sehingga setiap sprite sheet terdiri dari 12 frame. Objek yang dibuat memiliki ukuran tampilan 100×100 piksel. Pada awal permainan, seluruh objek langsung dibuat (*startup phase*) sesuai jumlah beban pengujian. Setiap objek diberikan sprite sheet secara acak dari tiga aset yang tersedia, memilih frame awal secara acak (0–11), serta ditempatkan pada posisi acak dalam rentang koordinat X: 0–1920 dan Y: 0–1080. Seluruh referensi objek yang berhasil dibuat disimpan ke dalam sebuah struktur data List.*

*Setelah seluruh objek selesai dibuat, sistem memasuki masa jeda (*cooldown*) selama 5 detik. Selanjutnya, setiap 200 ms sistem melakukan iterasi terhadap seluruh objek yang tersimpan pada List dan memperbarui sprite yang digunakan dengan memilih aset sprite sheet secara acak serta frame secara acak. Aset yang digunakan harus dirender secara linear/pixel-perfect tanpa efek transformasi tambahan yang dapat memengaruhi hasil pengujian. Setiap engine diperbolehkan menggunakan sistem animasi internal maupun mekanisme pergantian frame secara manual selama persyaratan skenario tetap terpenuhi. Pengujian dilakukan selama 30 detik dan nilai yang dicatat merupakan Average FPS pada 5 detik terakhir pengujian, 1% Low FPS, dan penggunaan JavaScript Heap.*

#### Beban 100 Objek

| Nama Engine | Average FPS (5 Detik Terakhir) | 1% Low FPS | JS Heap |
| :--- | :---: | :---: | :---: |
| **Lupis Engine** | 144 FPS | 141 FPS | 84 MB |
| **GDevelop** | 144 FPS | 141 FPS | 98 MB |
| **Construct 3** | 144 FPS | 141 FPS | 15 MB |
| **Excalibur** | 144 FPS | 141 FPS | 89 MB |
| **Phaser** | 144 FPS | 141 FPS | 22 MB |

#### Beban 500 Objek

| Nama Engine | Average FPS (5 Detik Terakhir) | 1% Low FPS | JS Heap |
| :--- | :---: | :---: | :---: |
| **Lupis Engine** | 144 FPS | 141 FPS | 87 MB |
| **GDevelop** | 144 FPS | 141 FPS | 160 MB |
| **Construct 3** | 144 FPS | 141 FPS | 75 MB |
| **Excalibur** | 83 FPS | 48 FPS | 143 MB |
| **Phaser** | 144 FPS | 141 FPS | 38 MB |


#### Beban 2.000 Objek

| Nama Engine | Average FPS (5 Detik Terakhir) | 1% Low FPS | JS Heap |
| :--- | :---: | :---: | :---: |
| **Lupis Engine** | 140 FPS | 72 FPS | 123 MB |
| **GDevelop** | 124 FPS | 29 FPS | 294 MB |
| **Construct 3** | 98 FPS | 12 FPS | 88 MB |
| **Excalibur** | 5 FPS | 4 FPS | 249 MB |
| **Phaser** | 144 FPS | 141 FPS | 51 MB |

#### Beban 5.000 Objek

| Nama Engine | Average FPS (5 Detik Terakhir) | 1% Low FPS | JS Heap |
| :--- | :---: | :---: | :---: |
| **Lupis Engine** | 85 FPS | 16 FPS | 134 MB |
| **GDevelop** | 93 FPS | 10 FPS | 541 MB |
| **Construct 3** | 37 FPS | 2 FPS | 102 MB |
| **Excalibur** | 1 FPS | 0 FPS | 1075 MB |
| **Phaser** | 144 FPS | 141 FPS | 85 MB |

#### Tujuan Pengujian

Pengujian ini bertujuan untuk mengevaluasi kemampuan setiap *engine* dalam mengelola sprite berbasis tekstur, melakukan pergantian asset secara dinamis, serta memperbarui frame sprite dalam jumlah besar secara berulang. Skenario ini dirancang untuk memberikan beban yang lebih mendekati kondisi permainan sebenarnya dibandingkan pengujian berbasis geometri sederhana, karena melibatkan proses manajemen tekstur, pergantian frame, dan pembaruan data visual secara simultan.

---
