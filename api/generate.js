// api/generate.js - VERSI BARU YANG DINAMIS (PERBAIKAN)

const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // 1. Memeriksa Metode Request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Hanya request POST yang diizinkan.' });
  }

  // 2. Memeriksa dan Mengamankan API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("!!! KESALAHAN FATAL: GEMINI_API_KEY tidak ditemukan di environment variables !!!");
    return res.status(500).json({ 
      error: "Kesalahan Konfigurasi Server: Kunci API rahasia tidak dapat diakses. Hubungi admin." 
    });
  }
  
  try {
    // 3. Mengambil SEMUA data dari frontend
    const { kategori, ide, gayaBahasa, gayaVisual } = req.body;

    // Validasi input dasar
    if (!kategori || !ide || !gayaBahasa || !gayaVisual) {
        return res.status(400).json({ error: "Input tidak lengkap. Semua kolom harus diisi." });
    }

    // --- BAGIAN UTAMA: PEMBENTUKAN PROMPT DINAMIS ---
    const prompt = `
Anda adalah seorang penulis skrip dan direktur seni AI untuk konten YouTube Shorts.
Tugas Anda adalah membuat skrip lengkap berdasarkan spesifikasi berikut:

**1. KATEGORI KONTEN:** ${kategori}

**2. GAYA BAHASA / PERSONA NARATOR:**
Gunakan gaya bahasa "${gayaBahasa}". Jika gaya yang dipilih adalah "Tegas & Santai (Gaya 'Bro')", maka adopsi persona berikut:
- Persona: Pria maskulin sejati, tegas, dominan, tenang, berwibawa. Seolah sedang berbicara empat mata dengan teman dekatnya (bro).
- Nada: Rendah, stabil, percaya diri.
- Gaya Bicara: Singkat, to the point, lugas, reflektif, tidak mendramatisir. Gunakan sapaan "bro", "lo", "gue".
- Getaran: Seperti mentor atau pemimpin yang sudah berpengalaman.

**3. GAYA VISUAL KONTEN:**
Setiap segmen narasi HARUS disertai dengan deskripsi prompt visual untuk AI generator gambar. Prompt visual ini harus dibuat dengan gaya "${gayaVisual}".

**4. IDE UTAMA / KUTIPAN YANG DIBAHAS:**
"${ide}"

**5. FORMAT OUTPUT (SANGAT PENTING):**
Tulis jawaban persis dengan struktur dan urutan di bawah ini. JANGAN mengubah struktur, menambah bagian, atau menggunakan format markdown.

JUDUL: [Buat judul yang menarik dan dioptimalkan untuk SEO YouTube berdasarkan ide utama]

DESKRIPSI: [Buat deskripsi singkat yang menarik, sertakan ajakan subscribe, dan tema bahasan]

TAGS: [Buat 5-10 tag relevan yang dipisahkan koma]

HASHTAGS: [Buat 3-5 hashtag relevan]

NARASI:
SEGMENT 1: [Narasi untuk 5 detik pertama (Hook)] + (Prompt Visual: deskripsi gambar detail dengan gaya ${gayaVisual})
SEGMENT 2: [Narasi untuk 7 detik berikutnya] + (Prompt Visual: deskripsi gambar detail dengan gaya ${gayaVisual})
SEGMENT 3: [Narasi untuk 6 detik berikutnya (Fakta/Poin Pendukung)] + (Prompt Visual: deskripsi gambar detail dengan gaya ${gayaVisual})
SEGMENT 4: [Narasi untuk 7 detik berikutnya] + (Prompt Visual: deskripsi gambar detail dengan gaya ${gayaVisual})
SEGMENT 5: [Narasi untuk 10 detik berikutnya (Pembahasan Inti Ide/Kutipan)] + (Prompt Visual: deskripsi gambar detail dengan gaya ${gayaVisual})
SEGMENT 6: [Narasi untuk 5 detik berikutnya] + (Prompt Visual: deskripsi gambar detail dengan gaya ${gayaVisual})
SEGMENT 7: [Narasi untuk 10 detik berikutnya (Refleksi/Pertanyaan)] + (Prompt Visual: deskripsi gambar detail dengan gaya ${gayaVisual})
SEGMENT 8: [Narasi untuk 10 detik terakhir (Closing/Call to Action)] + (Prompt Visual: deskripsi gambar detail dengan gaya ${gayaVisual})
`;

    // 4. Menghubungi Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Mengirim Hasil Kembali ke Frontend
    res.status(200).json({ script: text });

  } catch (error) {
    console.error("Error saat proses generate:", error);
    res.status(500).json({ error: `Terjadi kesalahan internal saat menghubungi AI: ${error.message}` });
  }
}
