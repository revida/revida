const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Baca file README.md
const readmePath = path.join(__dirname, 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf-8');

// Ganti dengan username dan repositori Anda
const username = 'revida';
const repo = 'revida';
const token = process.env.GH_TOKEN; // Mengambil token dari environment variable

async function calculateTotalContributionDays() {
    try {
        let totalDays = 0;
        let page = 1;

        while (true) {
            const url = `https://api.github.com/repos/${username}/${repo}/commits?per_page=100&page=${page}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${token}`,
                },
            });

            if (response.data.length === 0) {
                break; // Tidak ada lagi commit
            }

            // Mengambil tanggal dari setiap commit dan menyimpan ke dalam set untuk menghitung hari unik
            const uniqueDates = new Set();
            response.data.forEach(commit => {
                const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
                uniqueDates.add(date);
            });

            totalDays += uniqueDates.size; // Menambahkan jumlah hari unik ke total
            page++; // Pindah ke halaman berikutnya
        }

        return totalDays; // Mengembalikan jumlah hari unik
    } catch (error) {
        console.error('Error fetching contributions:', error);
        return 0; // Mengembalikan 0 jika ada error
    }
}

async function updateReadme() {
    const totalActiveDays = await calculateTotalContributionDays();

    // Update badge total active days
    const newBadge = `![Total Days Active](https://img.shields.io/badge/Total%20Days%20Active-${totalActiveDays}-blue?style=for-the-badge)`;
    const badgeRegex = /<img src="https:\/\/img.shields.io\/badge\/Total%20Days%20Active-[0-9]+-blue\?style=for-the-badge" alt="Total Days Active"\/?>/;

    // Ganti badge lama dengan yang baru
    readmeContent = readmeContent.replace(badgeRegex, newBadge);

    // Tulis kembali ke README.md
    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
}

// Jalankan fungsi untuk memperbarui README
updateReadme();
