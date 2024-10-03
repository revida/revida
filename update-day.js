const fs = require('fs');
const axios = require('axios');

const username = 'revida';
const token = process.env.GH_DAY;

async function getTotalActiveDays() {
    const url = `https://api.github.com/users/${username}/events`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${token}`
            }
        });

        const events = response.data;
        const activeDays = new Set();

        events.forEach(event => {
            const date = new Date(event.created_at);
            const formattedDate = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            activeDays.add(formattedDate);
        });

        console.log(`Total active days: ${activeDays.size}`);
        return activeDays.size; // Kembalikan jumlah hari aktif
    } catch (error) {
        console.error('Error fetching data from GitHub API:', error);
    }
}

async function updateReadme(activeDays) {
    const readmePath = 'README.md';
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');

    // Update badge
    const newContent = readmeContent.replace(/Total%20Days%20Active-\d+/g, `Total%20Days%20Active-${activeDays}`);
    fs.writeFileSync(readmePath, newContent);
}

(async () => {
    const activeDays = await getTotalActiveDays();
    if (activeDays !== undefined) {
        await updateReadme(activeDays);
    }
})();
