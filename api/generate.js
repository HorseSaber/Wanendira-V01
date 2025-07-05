// api/generate.js - VERSI FINAL DENGAN PROMPT SUPER TEGAS

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

    const { ide } = req.body;
    
    if (!ide) {
        return res.status(400).json({ error: "Input tidak lengkap. Kolom ide harus diisi." });
    }

    // === PROMPT SUPER TEGAS ===
    const prompt = `
      PERINTAH TEGAS: Anda adalah seorang penulis skrip YouTube Shorts profesional dari Indonesia.
      HASIL WAJIB DALAM BAHASA INDONESIA.

      TUGAS: Buat sebuah paket konten lengkap untuk YouTube Shorts berdasarkan Ide Utama berikut: "${ide}"

      Gunakan persona dan gaya bahasa "Alpha Gentle": tegas, dominan, tenang, to the point, lugas, dan reflektif.
      
      ATURAN FORMAT OUTPUT:
      - Ikuti struktur di bawah ini dengan SANGAT KETAT.
      - Jangan membuat teks atau penjelasan lain di luar struktur ini.
      - Setiap bagian harus diawali dengan emoji dan judul yang sama persis seperti contoh.
      - Pastikan total durasi narasi sekitar 50-60 detik.

      ---
      🎬 JUDUL:
      [Buat judul yang kuat dan lugas di sini]

      ---
      📝 DESKRIPSI:
      [Buat deskripsi yang reflektif dan diakhiri dengan ajakan subscribe serta beberapa hashtag relevan]

      ---
      🎤 NARASI [TOTAL 50-60 DETIK]:

      [0-10 detik]
      [Tulis narasi pembuka yang kuat di sini]

      [10-25 detik]
      [Kembangkan ide dengan fakta atau pertanyaan menantang]

      [25-40 detik]
      [Sampaikan inti pesan atau prinsip utama]

      [40-55 detik]
      [Berikan panggilan untuk bertindak atau sebuah kesimpulan tegas]

      [55-60 detik]
      [Tutup dengan satu kalimat akhir yang sangat kuat dan meninggalkan kesan]
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
