const fs = require('fs');
const path = require('path');

// Baca file README.md
const readmePath = path.join(__dirname, 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf-8');

// Hitung total hari aktif (ganti dengan logika Anda)
const totalActiveDays = calculateTotalActiveDays(); // Misal, ini bisa mengembalikan angka total hari

// Update badge total active days
const newBadge = `![Total Days Active](https://img.shields.io/badge/Total%20Days%20Active-${totalActiveDays}-blue?style=for-the-badge)`;
readmeContent = readmeContent.replace(/Total Days Active.*?\n/, newBadge + '\n');

// Tulis kembali ke README.md
fs.writeFileSync(readmePath, readmeContent, 'utf-8');

function calculateTotalActiveDays() {
    // Logika untuk menghitung total hari aktif
    return 10; // Ganti dengan logika yang sesuai
}
