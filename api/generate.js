// api/generate.js

// Ini adalah cara kita memanggil library AI dari Google
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ini adalah fungsi utama yang akan dijalankan oleh Vercel
// 'req' adalah permintaan dari Pelayan (Frontend)
// 'res' adalah jawaban yang akan kita kirim kembali
export default async function handler(req, res) {
  // Pastikan hanya metode POST yang diizinkan (untuk keamanan)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Ambil API Key dari 'Brankas' (Environment Variables)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    // Ambil 'kertas pesanan' dari Pelayan
    const { kategori, ide, gayaBahasa, gayaVisual } = req.body;

    // Rakit 'Super Prompt' yang sudah kita diskusikan
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

    // Kirim prompt ke Gemini dan tunggu hasilnya
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Kirim kembali hasil masakan (teks dari AI) ke Pelayan
    res.status(200).json({ script: text });

  } catch (error) {
    // Jika ada error di dapur, kirim pesan error
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan.' });
  }
}
