// api/generate.js - VERSI BARU DENGAN LOGIKA MULTI-KATEGORI (PERBAIKAN FINAL)

const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- TEMPLATE PROMPT DISIMPAN DI SINI AGAR RAPI ---

function getMotivasiPrompt(ide, gayaBahasa, gayaVisual) {
  return `
Anda adalah seorang penulis skrip dan direktur seni AI untuk konten YouTube Shorts.
Tugas Anda adalah membuat skrip lengkap berdasarkan spesifikasi berikut:

1. KATEGORI KONTEN: Motivasi (Reflektif)

2. GAYA BAHASA / PERSONA NARATOR:
Gunakan gaya bahasa "${gayaBahasa}". Jika gaya yang dipilih adalah "Tegas & Santai (Gaya 'Bro')", maka adopsi persona berikut:
- Persona: Pria maskulin sejati, tegas, dominan, tenang, berwibawa. Seolah sedang berbicara empat mata dengan teman dekatnya (bro).
- Nada: Rendah, stabil, percaya diri.
- Gaya Bicara: Singkat, to the point, lugas, reflektif, tidak mendramatisir. Gunakan sapaan "bro", "lo", "gue".

3. GAYA VISUAL KONTEN:
Setiap segmen narasi HARUS disertai dengan deskripsi prompt visual untuk AI generator gambar. Prompt visual ini harus dibuat dengan gaya "${gayaVisual}".

4. IDE UTAMA / KUTIPAN YANG DIBAHAS:
"${ide}"

5. FORMAT OUTPUT (SANGAT PENTING):
Tulis jawaban persis dengan struktur dan urutan di bawah ini. JANGAN mengubah struktur atau format.

JUDUL: [Buat judul yang menarik dan SEO-friendly]
DESKRIPSI: [Buat deskripsi singkat, sertakan ajakan subscribe]
TAGS: [Buat 5-10 tag relevan dipisahkan koma]
HASHTAGS: [Buat 3-5 hashtag relevan]

NARASI:
SEGMENT 1: [Hook 5 detik] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 2: [Narasi 7 detik] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 3: [Narasi 6 detik] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 4: [Narasi 7 detik] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 5: [Narasi 10 detik - Inti] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 6: [Narasi 5 detik] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 7: [Narasi 10 detik - Refleksi] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 8: [Narasi 10 detik - Closing/CTA] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
`;
}

function getCerpenPrompt(ide, gayaBahasa, gayaVisual) {
  return `
Anda adalah seorang pendongeng ulung dan direktur seni AI untuk YouTube Shorts.
Tugas Anda adalah membuat skrip cerita pendek yang menyentuh berdasarkan spesifikasi berikut:

1. KATEGORI KONTEN: Cerita Pendek (Mendongeng)

2. GAYA BAHASA / PERSONA NARATOR:
Gunakan gaya bahasa "${gayaBahasa}". Utamakan suara yang hangat, imajinatif, dan menarik (seperti narator dongeng klasik).

3. GAYA VISUAL KONTEN:
Setiap segmen narasi HARUS disertai dengan deskripsi prompt visual untuk AI generator gambar, dengan gaya "${gayaVisual}".

4. IDE UTAMA CERITA:
"${ide}"

5. STRUKTUR NARATIF YANG DIINGINKAN:
- Perkenalkan karakter dan situasinya (Hook).
- Bangun konflik atau masalah yang dihadapi.
- Capai klimaks atau titik balik cerita.
- Berikan resolusi atau pesan moral yang memuaskan di akhir.

6. FORMAT OUTPUT (SANGAT PENTING):
Tulis jawaban persis dengan struktur dan urutan di bawah ini. JANGAN mengubah struktur.

JUDUL: [Buat judul dongeng yang magis dan menarik]
DESKRIPSI: [Buat deskripsi singkat yang menggugah rasa penasaran]
TAGS: [Buat 5-10 tag relevan: ceritapendek, dongeng, animasi, dll]
HASHTAGS: [Buat 3-5 hashtag relevan: #ShortsCerita, #Dongeng, dll]

NARASI:
SEGMENT 1: [Perkenalan karakter/setting] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 2: [Awal mula masalah/konflik] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 3: [Masalah semakin besar] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 4: [Momen putus asa] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 5: [Titik balik / Klimaks cerita] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 6: [Awal resolusi] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 7: [Resolusi cerita] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 8: [Pesan moral / Kalimat penutup yang indah] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
`;
}

function getFaktaSejarahPrompt(ide, gayaBahasa, gayaVisual) {
    return `
Anda adalah seorang host acara sejarah yang antusias dan direktur seni AI untuk YouTube Shorts.
Tugas Anda adalah membuat skrip yang mengungkap fakta sejarah mengejutkan berdasarkan spesifikasi ini:

1. KATEGORI KONTEN: Fakta Sejarah

2. GAYA BAHASA / PERSONA NARATOR:
Gunakan gaya bahasa "${gayaBahasa}". Utamakan gaya penyampaian yang bersemangat, jelas, dan membuat penasaran (seperti host kanal YouTube populer tentang sejarah).

3. GAYA VISUAL KONTEN:
Setiap segmen narasi HARUS disertai dengan deskripsi prompt visual untuk AI generator gambar, dengan gaya "${gayaVisual}". Gunakan visual yang dinamis, seperti peta animasi atau perbandingan dulu-sekarang.

4. TOPIK UTAMA SEJARAH:
"${ide}"

5. STRUKTUR KONTEN YANG DIINGINKAN:
- Hook dengan pertanyaan provokatif.
- Berikan konteks sejarah yang cepat dan padat.
- Ungkap fakta intinya secara dramatis.
- Jelaskan mengapa fakta ini penting atau "keren".
- Tutup dengan kalimat yang membuat penonton berpikir.

6. FORMAT OUTPUT (SANGAT PENTING):
Tulis jawaban persis dengan struktur dan urutan di bawah ini.

JUDUL: [Buat judul model "click-bait cerdas" yang berhubungan dengan fakta]
DESKRIPSI: [Buat deskripsi yang mengungkap sedikit tapi membuat penasaran]
TAGS: [Buat 5-10 tag relevan: faktasejarah, sejarahunik, tahukahkamu, dll]
HASHTAGS: [Buat 3-5 hashtag relevan: #FaktaSejarah, #Shorts, dll]

NARASI:
SEGMENT 1: [Hook / Pertanyaan provokatif] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 2: [Konteks sejarah singkat] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 3: [Pengungkapan fakta utama] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 4: [Detail pendukung fakta] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 5: [Penjelasan "Kenapa ini penting?"] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 6: [Fakta pendukung kedua (jika ada)] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 7: [Implikasi fakta tersebut] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
SEGMENT 8: [Kalimat penutup yang "mind-blowing"] + (Prompt Visual: deskripsi gambar dengan gaya ${gayaVisual})
`;
}

// === FUNGSI UTAMA HANDLER ===
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Kesalahan Konfigurasi Server: Kunci API tidak dapat diakses." });
  }
  
  try {
    const { kategori, ide, gayaBahasa, gayaVisual } = req.body;
    if (!kategori || !ide || !gayaBahasa || !gayaVisual) {
      return res.status(400).json({ error: "Input tidak lengkap. Semua kolom harus diisi." });
    }

    let prompt;

    // --- DI SINI LOGIKA PEMILIHAN PROMPT-NYA ---
    if (kategori === 'cerpen') {
        prompt = getCerpenPrompt(ide, gayaBahasa, gayaVisual);
    } else if (kategori === 'fakta-sejarah') {
        prompt = getFaktaSejarahPrompt(ide, gayaBahasa, gayaVisual);
    } else {
        // Default-nya adalah motivasi jika tidak ada yang cocok
        prompt = getMotivasiPrompt(ide, gayaBahasa, gayaVisual);
    }
    // --- AKHIR DARI LOGIKA PEMILIHAN ---

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ script: text });

  } catch (error) {
    console.error("Error saat proses generate:", error);
    res.status(500).json({ error: `Terjadi kesalahan internal saat menghubungi AI: ${error.message}` });
  }
}
