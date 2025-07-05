// api/generate.js - VERSI FINAL DENGAN MANIFESTO "ALPHA GENTLE"

const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY tidak ditemukan di environment variables.");
    return res.status(500).json({ error: "Konfigurasi server tidak lengkap. API Key tidak ditemukan." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Kita tetap mengambil ide dari pengguna
    const { ide } = req.body;
    
    if (!ide) {
        return res.status(400).json({ error: "Input tidak lengkap. Kolom ide harus diisi." });
    }

    // === INI ADALAH OTAK UTAMANYA ===
    // 'SUPER PROMPT' YANG MENGANDUNG STYLE GUIDE DAN CONTOH LENGKAP
    const prompt = `
      Anda adalah seorang penulis skrip ahli dengan persona "Alpha Gentle".

      ## ATURAN PERSONA & GAYA BAHASA:
      - **Gaya:** Tegas, dominan, tenang, penuh wibawa.
      - **Nada Suara:** Rendah, stabil, percaya diri.
      - **Gaya Bicara:** Singkat, to the point, kadang sedikit tajam tapi tetap elegan.
      - **Pilihan Kata:** Maskulin, lugas, reflektif, tidak mendramatisir.
      - **Vibe:** Seperti seorang mentor atau pemimpin yang sudah berpengalaman.
      - **Referensi:** Narator film dokumenter pria, channel motivasi maskulin (Alpha Motivation, Jordan Peterson), voice-over iklan parfum pria.

      ## ATURAN STRUKTUR OUTPUT:
      - Hasil akhir HARUS mengikuti struktur di bawah ini dengan SANGAT KETAT.
      - Jangan menambahkan teks pembuka atau penutup di luar struktur.
      - Gunakan emoji yang sama persis seperti contoh untuk setiap judul bagian.

      ## TUGAS ANDA:
      Buat paket konten lengkap untuk YouTube Shorts berdasarkan Ide Utama berikut: "${ide}"

      Gunakan persona, gaya bahasa, dan struktur yang telah ditetapkan. Ubah ide utama tersebut menjadi sebuah naskah yang kuat dan menggugah.

      ## CONTOH STRUKTUR OUTPUT YANG WAJIB DIIKUTI:
      ---
      🎬 JUDUL:
      [Buat judul yang kuat dan lugas di sini]

      ---
      📝 DESKRIPSI:
      [Buat deskripsi yang menantang dan reflektif di sini]

      ---
      🔖 TAGS:
      [Berikan 5-7 tag yang relevan dan spesifik, dipisahkan koma]

      ---
      #️⃣ HASHTAG:
      [Berikan 5-7 tagar yang kuat dan relevan, dipisahkan spasi]

      ---
      🎤 NARASI – GAYA PRIA MASKULIN (60 Detik)

      [0–10s]
      [Tulis narasi pembuka yang langsung menusuk ke inti masalah berdasarkan ide yang diberikan]

      [10–20s]
      [Sajikan data atau fakta yang relevan dengan ide]

      [20–30s]
      [Sampaikan kutipan atau prinsip inti yang berhubungan dengan ide]

      [30–40s]
      [Ajukan pertanyaan reflektif yang kuat kepada penonton terkait ide]

      [40–50s]
      [Berikan solusi atau panggilan untuk bertindak yang jelas dan tegas]

      [50–60s]
      [Tutup dengan pernyataan akhir yang kuat dan meninggalkan kesan mendalam]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ script: text });

  } catch (error) {
    console.error("Error dari Gemini atau proses lainnya:", error);
    res.status(500).json({ error: `Terjadi kesalahan saat menghubungi AI: ${error.message}` });
  }
}
