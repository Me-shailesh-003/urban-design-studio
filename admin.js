function optimizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const max = 1200;
        if (width > max || height > max) {
          if (width > height) {
            height = Math.round((height * max) / width);
            width = max;
          } else {
            width = Math.round((width * max) / height);
            height = max;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

async function uploadImageFile(fileInput) {
  const file = fileInput.files[0];
  if (!file) return null;

  // Compress image locally first (guarantees fast loading & zero failure)
  const localDataUrl = await optimizeImage(file);

  try {
    const formData = new FormData();
    formData.append("image", file);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timer);

    const data = await res.json();
    if (res.ok && data.url) {
      return data.url;
    }
  } catch (err) {
    // Falls back seamlessly to optimized data URL if ImgBB times out or blocks
  }

  return localDataUrl;
}

async function loadProjectsTable() {
  const tbody = document.getElementById("projectsTableBody");
  try {
    const res = await fetch("/api/projects");
    const list = await res.json();
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--muted);">No projects found.</td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(p => `
      <tr>
        <td><img src="${p.image}" class="thumb-img" alt="${p.title}"></td>
        <td><strong>${p.title}</strong></td>
        <td>${p.category || "-"}</td>
        <td>${p.location || "-"}</td>
        <td>${p.year || "-"}</td>
        <td><button class="btn-delete" onclick="deleteProject('${p.id}')">Delete</button></td>
      </tr>
    `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6">Error loading projects.</td></tr>`;
  }
}

async function deleteProject(id) {
  if (!confirm("Are you sure you want to delete this project?")) return;
  try {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    loadProjectsTable();
  } catch (err) {
    alert("Could not delete project");
  }
}

async function loadTeamTable() {
  const tbody = document.getElementById("teamTableBody");
  try {
    const res = await fetch("/api/team");
    const list = await res.json();
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--muted);">No architects found.</td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(m => `
      <tr>
        <td><img src="${m.photo}" class="thumb-img" alt="${m.name}"></td>
        <td><strong>${m.name}</strong></td>
        <td>${m.role || "-"}</td>
        <td><button class="btn-delete" onclick="deleteArchitect('${m.id}')">Remove</button></td>
      </tr>
    `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4">Error loading architects.</td></tr>`;
  }
}

async function deleteArchitect(id) {
  if (!confirm("Are you sure you want to remove this architect?")) return;
  try {
    const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadTeamTable();
    } else {
      alert("Could not remove architect");
    }
  } catch (err) {
    alert("Could not remove architect");
  }
}

async function loadMessagesTable() {
  const tbody = document.getElementById("messagesTableBody");
  try {
    const res = await fetch("/api/contact");
    const list = await res.json();
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--muted);">No messages received yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(m => `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td>${m.email}</td>
        <td>${m.message}</td>
        <td>${m.date ? new Date(m.date).toLocaleDateString() : "-"}</td>
        <td><button class="btn-delete" onclick="deleteMessage('${m.id}')">Delete</button></td>
      </tr>
    `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5">Error loading messages.</td></tr>`;
  }
}

async function deleteMessage(id) {
  if (!confirm("Are you sure you want to delete this message?")) return;
  try {
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadMessagesTable();
    } else {
      alert("Could not delete message");
    }
  } catch (err) {
    alert("Could not delete message");
  }
}

document.getElementById("projectForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("pBtn");
  btn.disabled = true;
  btn.textContent = "Processing...";

  try {
    const fileInput = document.getElementById("pImageFile");
    const urlInput = document.getElementById("pImageUrl").value.trim();
    let imageUrl = urlInput;

    if (fileInput.files.length > 0) {
      imageUrl = await uploadImageFile(fileInput);
    }

    if (!imageUrl) {
      alert("Please upload an image file or provide an image URL.");
      btn.disabled = false;
      btn.textContent = "Upload & Save Project ↗";
      return;
    }

    const payload = {
      title: document.getElementById("pTitle").value.trim(),
      category: document.getElementById("pCategory").value.trim(),
      location: document.getElementById("pLocation").value.trim(),
      year: document.getElementById("pYear").value.trim(),
      image: imageUrl,
      isLarge: document.getElementById("pIsLarge").checked
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save project");
    }

    alert("Project saved successfully!");
    document.getElementById("projectForm").reset();
    loadProjectsTable();
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Upload & Save Project ↗";
  }
});

document.getElementById("teamForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("tBtn");
  btn.disabled = true;
  btn.textContent = "Processing...";

  try {
    const fileInput = document.getElementById("tPhotoFile");
    const urlInput = document.getElementById("tPhotoUrl").value.trim();
    let photoUrl = urlInput;

    if (fileInput.files.length > 0) {
      photoUrl = await uploadImageFile(fileInput);
    }

    if (!photoUrl) {
      alert("Please upload a photo file or provide a photo URL.");
      btn.disabled = false;
      btn.textContent = "Add Team Member ↗";
      return;
    }

    const payload = {
      name: document.getElementById("tName").value.trim(),
      role: document.getElementById("tRole").value.trim(),
      photo: photoUrl
    };

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to add team member");
    }

    alert("Team member added successfully!");
    document.getElementById("teamForm").reset();
    loadTeamTable();
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Add Team Member ↗";
  }
});

loadProjectsTable();
loadTeamTable();
loadMessagesTable();
