const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxClose = document.getElementById("lightboxClose");

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function openLightbox(src, title) {
  lightboxImg.src = src;
  lightboxImg.alt = title;
  lightboxTitle.textContent = title;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

async function loadProjects() {
  const container = document.getElementById("projectGrid");
  try {
    const res = await fetch("/api/projects");
    const projects = await res.json();

    if (!projects || projects.length === 0) {
      container.innerHTML = "<p>No projects found.</p>";
      return;
    }

    container.innerHTML = projects.map((p, index) => {
      const sizeClass = p.isLarge ? "project-large" : "project-small";
      const offsetClass = index === 3 ? "project-offset" : "";
      return `
        <article class="project-card ${sizeClass} ${offsetClass}">
          <button class="project-image" data-image="${p.image}" data-title="${p.title}">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
            <span class="project-plus">+</span>
          </button>
          <div class="project-meta">
            <div>
              <span>${p.category || "Architecture"}</span>
              <h3>${p.title}</h3>
            </div>
            <span>${p.year || ""} ${p.location ? "· " + p.location : ""}</span>
          </div>
        </article>
      `;
    }).join("");

    container.querySelectorAll(".project-image").forEach((btn) => {
      btn.addEventListener("click", () => {
        openLightbox(btn.dataset.image, btn.dataset.title);
      });
    });
  } catch (err) {
    container.innerHTML = "<p>Unable to load projects.</p>";
  }
}

async function loadTeam() {
  const container = document.getElementById("teamGrid");
  try {
    const res = await fetch("/api/team");
    const team = await res.json();

    if (!team || team.length === 0) {
      container.innerHTML = "<p>No team members listed.</p>";
      return;
    }

    container.innerHTML = team.map((m) => `
      <article class="team-card ${m.isFeatured ? "team-featured" : ""}">
        <img src="${m.photo}" alt="${m.name}" loading="lazy">
        <h3>${m.name}</h3>
        <span>${m.role}</span>
      </article>
    `).join("");
  } catch (err) {
    container.innerHTML = "<p>Unable to load team.</p>";
  }
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("contactStatus");
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    status.textContent = "Sending...";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();

      if (res.ok) {
        status.textContent = "Thank you! Message saved successfully.";
        contactForm.reset();
      } else {
        status.textContent = data.error || "Failed to send message.";
      }
    } catch (err) {
      status.textContent = "Server error. Please try again.";
    }
  });
}

loadProjects();
loadTeam();
