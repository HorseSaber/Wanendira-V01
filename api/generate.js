// api/generate.js - VERSI REVISI

// Kita tidak perlu mengimpor library, Vercel sudah menyediakannya.
// Cukup gunakan 'require'
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // Pastikan ini adalah permintaan POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }

  // Cek apakah API Key ada di 'brankas' Vercel
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY tidak ditemukan di environment variables.");
    return res.status(500).json({ error: "Konfigurasi server tidak lengkap. API Key tidak ditemukan." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { kategori, ide, gayaBahasa, gayaVisual } = req.body;
    
    // Validasi input dasar
    if (!kategori || !ide || !gayaBahasa || !gayaVisual) {
        return res.status(400).json({ error: "Input tidak lengkap. Semua kolom harus diisi." });
    }

    const prompt = `
      Anda adalah seorang penulis skrip dan direktur seni AI yang ahli.
      Buatlah skrip untuk YouTube Shorts berdasarkan parameter berikut:
      - Kategori Konten: ${kategori}
      - Ide Utama: "${ide}"
      - Gaya Bahasa (Tone of Voice): ${gayaBahasa}
      - Gaya Visual: ${gayaVisual}

      Format output HARUS berupa narasi yang dipecah menjadi beberapa adegan (misal: ADEGAN 1, ADEGAN 2, dst.).
      Untuk SETIAP ADEGAN, sertakan [PROMPT VISUAL] yang detail dan siap pakai untuk generator gambar AI, sesuai dengan gaya visual yang diminta.
      Pastikan narasi dan prompt visualnya menyatu dan berkualitas tinggi.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Pastikan mengirim JSON yang valid saat berhasil
    res.status(200).json({ script: text });

  } catch (error) {
    // Ini bagian terpenting: menangani error dari Google atau lainnya
    console.error("Error dari Gemini atau proses lainnya:", error);
    
    // Kirim kembali pesan error yang lebih spesifik dalam format JSON
    res.status(500).json({ error: `Terjadi kesalahan saat menghubungi AI: ${error.message}` });
  }
}
