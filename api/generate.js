// api/generate.js - VERSI DENGAN FITUR "BUATKAN IDE"

const { GoogleGenerativeAI } = require("@google/generative-ai");

// [ ... SEMUA FUNGSI getMotivasiPrompt, getCerpenPrompt, getFaktaSejarahPrompt DARI SEBELUMNYA TETAP DI SINI, TIDAK PERLU DIUBAH ... ]
function getMotivasiPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode ... */ }
function getCerpenPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode ... */ }
function getFaktaSejarahPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode ... */ }


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
    const { kategori, ide, gayaBahasa, gayaVisual, task } = req.body; // 'task' adalah parameter baru

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt;

    // --- LOGIKA BARU: MEMERIKSA JENIS TUGAS ---
    if (task === 'generate_idea') {
        if (!kategori) {
             return res.status(400).json({ error: "Kategori harus dipilih untuk membuat ide." });
        }
        prompt = `Berikan satu saja ide atau topik yang menarik, singkat, dan spesifik untuk konten YouTube Shorts dengan kategori "${kategori}". Jawaban harus berupa satu kalimat saja, tanpa embel-embel atau penjelasan tambahan.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return res.status(200).json({ generated_idea: text.trim() }); // Kirim kembali sebagai ide
    }

    // --- LOGIKA LAMA UNTUK MEMBUAT SCRIPT LENGKAP ---
    if (!kategori || !ide || !gayaBahasa || !gayaVisual) {
      return res.status(400).json({ error: "Input tidak lengkap. Semua kolom harus diisi." });
    }

    if (kategori === 'cerpen') {
        prompt = getCerpenPrompt(ide, gayaBahasa, gayaVisual);
    } else if (kategori === 'fakta-sejarah') {
        prompt = getFaktaSejarahPrompt(ide, gayaBahasa, gayaVisual);
    } else {
        prompt = getMotivasiPrompt(ide, gayaBahasa, gayaVisual);
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ script: text });

  } catch (error) {
    console.error("Error saat proses generate:", error);
    res.status(500).json({ error: `Terjadi kesalahan internal saat menghubungi AI: ${error.message}` });
  }
}
