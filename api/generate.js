// api/generate.js - VERSI SUPER LENGKAP, FINAL, DAN TELAH DIPERBAIKI

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// =================================================================================
// BAGIAN 1: FUNGSI-FUNGSI TEMPLATE PROMPT (YANG HILANG SEBELUMNYA)
// =================================================================================

function getMotivasiPrompt(ide, gayaBahasa, gayaVisual) {
  return `
Anda adalah seorang penulis skrip dan direktur seni AI untuk konten YouTube Shorts.
Tugas Anda adalah membuat skrip lengkap berdasarkan spesifikasi berikut:
1. KATEGORI KONTEN: Motivasi (Reflektif)
2. GAYA BAHASA / PERSONA NARATOR: Gunakan gaya bahasa "${gayaBahasa}". Jika gaya yang dipilih adalah "Tegas & Santai (Gaya 'Bro')", maka adopsi persona: Pria maskulin, tegas, tenang, berwibawa, berbicara langsung pada teman. Gunakan sapaan "bro", "lo", "gue".
3. GAYA VISUAL KONTEN: Setiap segmen narasi HARUS disertai deskripsi prompt visual untuk AI generator gambar, dengan gaya "${gayaVisual}".
4. IDE UTAMA / KUTIPAN YANG DIBAHAS: "${ide}"
5. FORMAT OUTPUT (SANGAT PENTING): Tulis jawaban persis dengan struktur di bawah ini. JANGAN mengubah struktur atau format.

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
2. GAYA BAHASA / PERSONA NARATOR: Gunakan gaya bahasa "${gayaBahasa}". Utamakan suara yang hangat, imajinatif, dan menarik (seperti narator dongeng klasik).
3. GAYA VISUAL KONTEN: Setiap segmen narasi HARUS disertai deskripsi prompt visual untuk AI generator gambar, dengan gaya "${gayaVisual}".
4. IDE UTAMA CERITA: "${ide}"
5. STRUKTUR NARATIF YANG DIINGINKAN: Perkenalkan karakter dan situasinya, bangun konflik, capai klimaks, dan berikan resolusi yang memuaskan.
6. FORMAT OUTPUT (SANGAT PENTING): Tulis jawaban persis dengan struktur di bawah ini. JANGAN mengubah struktur.

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
2. GAYA BAHASA / PERSONA NARATOR: Gunakan gaya bahasa "${gayaBahasa}". Utamakan gaya penyampaian yang bersemangat, jelas, dan membuat penasaran.
3. GAYA VISUAL KONTEN: Setiap segmen narasi HARUS disertai deskripsi prompt visual untuk AI generator gambar, dengan gaya "${gayaVisual}".
4. TOPIK UTAMA SEJARAH: "${ide}"
5. STRUKTUR KONTEN YANG DIINGINKAN: Hook dengan pertanyaan provokatif, berikan konteks cepat, ungkap fakta intinya, jelaskan mengapa fakta ini penting, dan tutup dengan kalimat yang membuat berpikir.
6. FORMAT OUTPUT (SANGAT PENTING): Tulis jawaban persis dengan struktur di bawah ini.

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

// =================================================================================
// BAGIAN 2: FUNGSI UTAMA HANDLER
// =================================================================================
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Kesalahan Konfigurasi Server: Kunci API tidak dapat diakses." });
  }
  
  try {
    const { task, kategori, ide, gayaBahasa, gayaVisual } = req.body;
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    let prompt;

    if (task === 'generate_idea') {
      if (!kategori) { return res.status(400).json({ error: "Kategori harus dipilih untuk membuat ide." }); }
      prompt = `Berikan satu saja ide atau topik yang menarik, singkat, dan spesifik untuk konten YouTube Shorts dengan kategori "${kategori}". Jawaban harus berupa satu kalimat saja, tanpa embel-embel atau penjelasan tambahan.`;
      
      const result = await model.generateContent(prompt); // Versi sederhana untuk ide
      const text = result.response.text();
      return res.status(200).json({ generated_idea: text.trim() });

    } else { // Asumsikan tugas default adalah generate_script
      if (!kategori || !ide || !gayaBahasa || !gayaVisual) {
        return res.status(400).json({ error: "Input tidak lengkap. Semua kolom harus diisi." });
      }
  
      if (kategori === 'cerpen') {
          prompt = getCerpenPrompt(ide, gayaBahasa, gayaVisual);
      } else if (kategori === 'fakta-sejarah') {
          prompt = getFaktaSejarahPrompt(ide, gayaBahasa, gayaVisual);
      } else { // Default ke motivasi
          prompt = getMotivasiPrompt(ide, gayaBahasa, gayaVisual);
      }

      const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          safetySettings,
      });

      if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
          throw new Error("AI tidak memberikan jawaban yang valid (kemungkinan diblokir oleh filter keamanan). Coba sederhanakan idemu.");
      }

      const text = result.response.text();
      res.status(200).json({ script: text });
    }

  } catch (error) {
    console.error("Error dalam API Handler:", error);
    res.status(500).json({ error: `Terjadi kesalahan di server: ${error.message}` });
  }
}
