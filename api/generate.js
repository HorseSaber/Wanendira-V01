// api/generate.js - VERSI DENGAN PERBAIKAN PROMPT DAN SAFETY SETTINGS

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// Fungsi template tidak perlu diubah, kita akan perbaiki cara pemanggilannya nanti.
function getMotivasiPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode sama persis seperti sebelumnya ... */ }
function getCerpenPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode sama persis seperti sebelumnya ... */ }
function getFaktaSejarahPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode sama persis seperti sebelumnya ... */ }

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
    // --- Bagian yang diubah: Dekonstruksi task ---
    const { task, ...payload } = req.body;
    const { kategori, ide, gayaBahasa, gayaVisual } = payload;
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- BAGIAN BARU: KONFIGURASI KEAMANAN ---
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
       {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
       {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    let prompt;

    if (task === 'generate_idea') {
      if (!kategori) {
           return res.status(400).json({ error: "Kategori harus dipilih untuk membuat ide." });
      }
      prompt = `Berikan satu saja ide atau topik yang menarik, singkat, dan spesifik untuk konten YouTube Shorts dengan kategori "${kategori}". Jawaban harus berupa satu kalimat saja, tanpa embel-embel atau penjelasan tambahan.`;
      
      const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          safetySettings,
      });
      const text = result.response.text();
      return res.status(200).json({ generated_idea: text.trim() });

    } else if (task === 'generate_script') {
        if (!kategori || !ide || !gayaBahasa || !gayaVisual) {
          return res.status(400).json({ error: "Input tidak lengkap. Semua kolom harus diisi." });
        }
    
        // --- PERBAIKAN LOGIKA PROMPT DI SINI ---
        if (kategori === 'cerpen') {
            prompt = getCerpenPrompt(ide, gayaBahasa, gayaVisual);
        } else if (kategori === 'fakta-sejarah') {
            prompt = getFaktaSejarahPrompt(ide, gayaBahasa, gayaVisual);
        } else {
            prompt = getMotivasiPrompt(ide, gayaBahasa, gayaVisual);
        }

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            safetySettings,
        });

        // Pengecekan respons yang lebih baik
        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            const finishReason = result.response?.candidates?.[0]?.finishReason;
            if (finishReason === 'SAFETY') {
                throw new Error("Permintaan diblokir oleh filter keamanan AI. Coba gunakan ide atau gaya bahasa yang lebih netral.");
            }
            throw new Error("AI tidak memberikan jawaban yang valid (respons kosong).");
        }

        const text = result.response.text();
        res.status(200).json({ script: text });

    } else {
        return res.status(400).json({ error: 'Tugas tidak dikenali.' });
    }

  } catch (error) {
    // Menangkap error 'contents' dan memberikan pesan yang lebih jelas
    if (error.message.includes("content") || error.message.includes("contents")) {
         console.error("Error struktur konten atau AI response:", error);
         return res.status(500).json({ error: "Terjadi masalah internal: AI memberikan respons tidak terduga. Ini seringkali karena filter keamanan. Coba sederhanakan idemu." });
    }
    console.error("Error umum saat proses generate:", error);
    res.status(500).json({ error: `Terjadi kesalahan: ${error.message}` });
  }
}

// Salin dan tempel lagi ketiga fungsi template prompt (getMotivasiPrompt, getCerpenPrompt, getFaktaSejarahPrompt) di bawah ini
// untuk memastikan semuanya lengkap dalam satu file.
function getMotivasiPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode sama persis ... */ }
function getCerpenPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode sama persis ... */ }
function getFaktaSejarahPrompt(ide, gayaBahasa, gayaVisual) { /* ... kode sama persis ... */ }
