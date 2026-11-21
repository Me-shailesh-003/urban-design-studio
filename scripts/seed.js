const fs = require('fs');
const path = require('path');

// Resolve .env path from either root or scripts folder
const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

const fbUrl = process.env.FIREBASE_DB_URL ? process.env.FIREBASE_DB_URL.replace(/\/$/, '') : null;

// Resolve data.json path
const dataPath = fs.existsSync(path.join(__dirname, 'data', 'data.json'))
  ? path.join(__dirname, 'data', 'data.json')
  : path.join(__dirname, '..', 'data', 'data.json');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

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
