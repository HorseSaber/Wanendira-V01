// api/generate.js - VERSI DIAGNOSTIK

const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // === ALAT PELACAK DIMULAI DI SINI ===
  console.log("Fungsi 'generate' dipanggil...");

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("!!! FATAL: GEMINI_API_KEY tidak ada di process.env !!!");
    // Mengirim kembali JSON error yang jelas
    return res.status(500).json({ 
      error: "Kesalahan Konfigurasi Server: Kunci API rahasia tidak dapat diakses. Silakan periksa pengaturan Environment Variable di Vercel." 
    });
  }
  
  console.log("SUKSES: GEMINI_API_KEY berhasil dibaca dari environment.");
  // Kita tidak akan log kuncinya, cukup konfirmasi bahwa itu ada.

  // === ALAT PELACAK SELESAI ===


  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey); // Gunakan apiKey yang sudah kita ambil
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { ide: kutipan } = req.body;
    
    if (!kutipan) {
        return res.status(400).json({ error: "Input tidak lengkap. Kolom ide/kutipan harus diisi." });
    }

    const prompt = `
Tugas Anda adalah membuat skrip konten YouTube Shorts berdurasi total 60 detik.
Fokus konten adalah motivasi pria dewasa dengan sudut pandang dominan, kuat, dan maskulin.
Topik akan berpusat pada sebuah kutipan yang mencerminkan kontrol, dominasi, disiplin, atau keunggulan hidup sebagai pria berkelas.

⚠️ STRUKTUR OUTPUT WAJIB (Tanpa improvisasi atau perubahan format):
TIDAK BOLEH MENGUBAH STRUKTUR INI DALAM KONDISI APA PUN.
PELANGGARAN STRUKTUR AKAN DIANGGAP KELUAR DARI TUGAS.

Tulis jawabanmu persis dengan urutan berikut:

JUDUL: ...
DESKRIPSI: ...
TAGS: ...
HASHTAGS: ...
NARASI:
[0–10s]
[10–20s]
[20–30s]
[30–40s]
[40–50s]
[50–60s]

🧠 GAYA BAHASA: "ALPHA GENTLE / PRIA MASKULIN DOMINAN"

Spesifikasi Gaya:
- Nada suara tenang, rendah, percaya diri
- Kalimat singkat, tidak emosional berlebihan
- Hindari kata-kata lembek atau ajakan manja
- Gunakan kosakata: kendali, dominasi, arahkan, kuasai, tahan, disiplin, batas, tegas

🛑 DILARANG:
- Mengubah struktur
- Menambah bagian
- Menggunakan gaya motivasi biasa, curhat, sinetron, atau puitis

📌 KUTIPAN YANG AKAN DIBAHAS:
"${kutipan}"

Berikan hasil dalam format teks biasa. Tanpa markdown, tanpa emoji, tanpa penjelasan tambahan.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ script: text });

  } catch (error) {
    console.error("Error saat generate konten:", error);
    res.status(500).json({ error: `Terjadi kesalahan saat menghubungi AI: ${error.message}` });
  }
}
