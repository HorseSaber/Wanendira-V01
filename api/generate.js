// api/generate.js - VERSI UPGRADE DENGAN FORMAT OUTPUT

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

    const { kategori, ide, gayaBahasa, gayaVisual } = req.body;
    
    if (!kategori || !ide || !gayaBahasa || !gayaVisual) {
        return res.status(400).json({ error: "Input tidak lengkap. Semua kolom harus diisi." });
    }

    // === INI BAGIAN YANG KITA UPGRADE ===
    // 'SUPER PROMPT' DENGAN INSTRUKSI FORMAT YANG SANGAT JELAS
    const prompt = `
      Anda adalah seorang kreator konten dan penulis skrip ahli untuk YouTube Shorts.
      Tugas Anda adalah membuat paket konten lengkap berdasarkan parameter berikut:
      - Kategori Konten: ${kategori}
      - Ide Utama: "${ide}"
      - Gaya Bahasa (Tone of Voice): ${gayaBahasa}
      - Gaya Visual: ${gayaVisual}

      HASIL AKHIR HARUS MENGIKUTI STRUKTUR DI BAWAH INI DENGAN SANGAT KETAT, TANPA TEKS PEMBUKA ATAU PENUTUP LAINNYA.
      Gunakan pemisah "---" untuk memisahkan setiap bagian utama.

      ---
      **Segmen Narasi 1:**
      [Tulis narasi untuk segmen pertama di sini]
      **Prompt Visual Segmen 1:**
      [Tulis prompt visual yang detail untuk segmen pertama di sini, sesuai gaya visual yang diminta]

      **Segmen Narasi 2:**
      [Tulis narasi untuk segmen kedua di sini]
      **Prompt Visual Segmen 2:**
      [Tulis prompt visual yang detail untuk segmen kedua di sini]

      **Segmen Narasi 3:**
      [Tulis narasi untuk segmen ketiga di sini]
      **Prompt Visual Segmen 3:**
      [Tulis prompt visual yang detail untuk segmen ketiga di sini]

      (Lanjutkan hingga 5 atau 6 segmen, sesuaikan dengan alur cerita)

      ---
      **Judul Video:**
      [Buat judul yang menarik dan ringkas, maksimal 70 karakter]

      ---
      **Deskripsi Video:**
      [Buat deskripsi singkat yang merangkum isi video dan menyertakan ajakan untuk subscribe]

      ---
      **Tagar:**
      [Berikan 5-10 tagar yang relevan, dipisahkan oleh spasi, diawali dengan #]
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
