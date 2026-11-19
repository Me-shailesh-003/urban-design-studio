const fs = require('fs');
const path = require('path');
require('dotenv').config();

const fbUrl = process.env.FIREBASE_DB_URL ? process.env.FIREBASE_DB_URL.replace(/\/$/, '') : null;
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'data.json'), 'utf8'));

async function seed() {
  if (!fbUrl) {
    console.log('Firebase URL not found in .env');
    return;
  }

  console.log('Syncing data to Firebase Realtime Database...');
  
  const projectsRes = await fetch(`${fbUrl}/projects.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.projects)
  });

  const teamRes = await fetch(`${fbUrl}/team.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.team)
  });

  if (projectsRes.ok && teamRes.ok) {
    console.log('Success: Projects and Team data pushed to Firebase!');
  } else {
    console.log('Permission denied. Please update Firebase rules to true and publish.');
  }
}

seed().catch(console.error);
