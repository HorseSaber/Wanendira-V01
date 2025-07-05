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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
