const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'data', 'data.json');
const fbUrl = process.env.FIREBASE_DB_URL ? process.env.FIREBASE_DB_URL.replace(/\/$/, '') : null;

async function getFromDb(collection) {
  try {
    if (fbUrl) {
      const res = await fetch(`${fbUrl}/${collection}.json`);
      const data = await res.json();
      if (!data) return [];
      if (Array.isArray(data)) {
        return data
          .map((item, index) => (item ? { ...item, id: index.toString() } : null))
          .filter(Boolean);
      }
      return Object.keys(data).map(key => ({ ...data[key], id: key }));
    }
    const file = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(file);
    return parsed[collection] || [];
  } catch (err) {
    return [];
  }
}

async function addToDb(collection, item) {
  if (fbUrl) {
    const res = await fetch(`${fbUrl}/${collection}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const result = await res.json();
    return { id: result.name, ...item };
  }
  const file = fs.readFileSync(DB_FILE, 'utf8');
  const parsed = JSON.parse(file);
  const newItem = { id: Date.now().toString(), ...item };
  if (!parsed[collection]) parsed[collection] = [];
  parsed[collection].push(newItem);
  fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2));
  return newItem;
}

async function deleteFromDb(collection, id) {
  if (fbUrl) {
    await fetch(`${fbUrl}/${collection}/${id}.json`, { method: 'DELETE' });
    return true;
  }
  const file = fs.readFileSync(DB_FILE, 'utf8');
  const parsed = JSON.parse(file);
  if (parsed[collection]) {
    parsed[collection] = parsed[collection].filter(item => item.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2));
  }
  return true;
}

const router = express.Router();

// ImgBB upload endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image file' });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'ImgBB API key not configured' });
    }

    const form = new FormData();
    form.append('image', req.file.buffer.toString('base64'));

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: form
    });
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ error: data.error ? data.error.message : 'Upload failed' });
    }

    res.json({ url: data.data.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects API
router.get('/projects', async (req, res) => {
  const projects = await getFromDb('projects');
  res.json(projects);
});

router.post('/projects', async (req, res) => {
  const { title, category, location, year, image, isLarge } = req.body;
  if (!title || !image) {
    return res.status(400).json({ error: 'Title and image are required' });
  }

  const project = await addToDb('projects', {
    title,
    category: category || 'Architecture',
    location: location || 'India',
    year: year || new Date().getFullYear().toString(),
    image,
    isLarge: Boolean(isLarge)
  });
  res.status(201).json(project);
});

router.delete('/projects/:id', async (req, res) => {
  await deleteFromDb('projects', req.params.id);
  res.json({ success: true });
});

// Team API
router.get('/team', async (req, res) => {
  const team = await getFromDb('team');
  res.json(team);
});

router.post('/team', async (req, res) => {
  const { name, role, photo, isFeatured } = req.body;
  if (!name || !role || !photo) {
    return res.status(400).json({ error: 'Name, role, and photo are required' });
  }

  const member = await addToDb('team', {
    name,
    role,
    photo,
    isFeatured: Boolean(isFeatured)
  });
  res.status(201).json(member);
});

router.delete('/team/:id', async (req, res) => {
  await deleteFromDb('team', req.params.id);
  res.json({ success: true });
});

// Contact API
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const entry = await addToDb('messages', {
    name,
    email,
    message,
    date: new Date().toISOString()
  });
  res.status(201).json({ success: true, message: 'Message sent successfully' });
});

router.get('/contact', async (req, res) => {
  const messages = await getFromDb('messages');
  res.json(messages);
});

// Support both /api/path and /path
app.use('/api', router);
app.use('/', router);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
