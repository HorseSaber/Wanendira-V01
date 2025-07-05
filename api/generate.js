// api/generate.js - VERSI FINAL DENGAN CETAK BIRU DARI PENGGUNA

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // "Ide" dari pengguna sekarang kita anggap sebagai "Kutipan"
    const { ide: kutipan } = req.body;
    
    if (!kutipan) {
        return res.status(400).json({ error: "Input tidak lengkap. Kolom ide/kutipan harus diisi." });
    }

    // === CETAK BIRU PROMPT YANG DI-UPGRADE ===
    const prompt = `
      Tugas Anda adalah membuat skrip konten YouTube Shorts berdurasi total 60 detik.
      Fokus konten adalah motivasi pria dewasa dengan sudut pandang dominan, kuat, dan maskulin.
      Topik akan berpusat pada sebuah kutipan yang mencerminkan kontrol, dominasi, disiplin, atau keunggulan hidup sebagai pria berkelas.

      ⚠️ STRUKTUR OUTPUT WAJIB (Tanpa improvisasi atau perubahan format):

      1. JUDUL: (maksimal 80 karakter, padat, tajam, tidak lebay)
      2. DESKRIPSI: (maksimal 4 baris, gaya tuturan pria tegas yang to the point, sertakan hashtag di akhir)
      3. TAGS: (dipisahkan dengan koma, SEO relevan dengan tema dominasi, pria, uang, kontrol, mentalitas alpha)
      4. NARASI (Durasi Total 60 Detik):
         - Bagi menjadi 6 segmen, masing-masing 10 detik
         - Formatnya: **[0–10s]**, **[10–20s]**, dst
         - Hindari kalimat panjang. Gunakan ritme pendek, tegas, powerful

      ------------------------------------

      🧠 GAYA BAHASA: "ALPHA GENTLE / PRIA MASKULIN DOMINAN"

      Spesifikasi Gaya:
      - Nada suara tenang, rendah, percaya diri
      - Gaya tuturan singkat, penuh makna, tidak emosional berlebihan
      - Hindari kata “teman-teman”, “yuk”, “semangat ya”, “percaya deh”, dan semua bentuk ajakan lembek
      - Gunakan kata-kata: **kendali, dominasi, kendurkan, tahan, arahkan, tetapkan, disiplin, batas, kuasai**
      - Tonenya seperti mentor atau ayah yang keras tapi ingin lo naik level
      - Jangan ajarkan jadi kuat, langsung ajak jadi kuat

      🛑 HINDARI:
      - Bahasa lembut, gaya sinetron, curhat, atau over-empati
      - Gaya motivasi biasa, penuh harapan kosong
      - Improvisasi gaya narasi

      ------------------------------------

      📌 KUTIPAN YANG AKAN DIBAHAS:

      **"${kutipan}"**

      Tugas Anda: Buat struktur konten YouTube Shorts 60 detik berdasarkan kutipan tersebut, menggunakan seluruh struktur dan gaya yang sudah dijelaskan di atas.
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
