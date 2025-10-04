// src/js/ui.js
let fullAnimeList = [];

const modal = document.getElementById("animeModal");
const modalBody = document.getElementById("modalBody");
const closeButton = document.querySelector(".close-button");
const animeContainer = document.getElementById("selection");

// Define which sites are for streaming vs. social
const STREAMING_SITES = ["Crunchyroll", "Hulu", "Netflix", "Funimation", "HIDIVE", "Prime Video", "VRV", "YouTube"];
const SOCIAL_SITES = ["Instagram", "Twitter", "TikTok", "Facebook"];

export function initializeUIEventListeners() {
  animeContainer.addEventListener("click", handleCardClick);
  closeButton.addEventListener("click", hideModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });
}

export function renderAnimeCards(animeList) {
  fullAnimeList = animeList;
  animeContainer.innerHTML = "";

  animeList.forEach((anime) => {
    if (anime) {
      const card = createAnimeCard(anime);
      animeContainer.appendChild(card);
    }
  });
}

function createAnimeCard(anime) {
  const animeInfoDiv = document.createElement("div");
  animeInfoDiv.classList.add("anime-info");
  animeInfoDiv.dataset.animeId = anime.id;
  const cleanDescription = anime.description ? anime.description.replace(/<br\s*\/?>/gi, " ") : "No description available.";

  animeInfoDiv.innerHTML = `
    <h3>${anime.title.romaji}</h3>
    <img src="${anime.coverImage.large}" alt="${anime.title.romaji} cover">
    <p>
        <strong>Score:</strong> ${anime.averageScore || "N/A"} / 100<br>
        <strong>Genres:</strong> ${anime.genres.join(", ")}<br>
        <strong>Episodes:</strong> ${anime.episodes || "N/A"}<br>
    </p>
    <p class="description">${cleanDescription.substring(0, 150)}...</p>
    `;
  return animeInfoDiv;
}

function handleCardClick(event) {
  const card = event.target.closest(".anime-info");
  if (card && card.dataset.animeId) {
    const animeId = parseInt(card.dataset.animeId, 10);
    const animeData = fullAnimeList.find((item) => item.id === animeId);
    if (animeData) {
      populateAndShowModal(animeData);
    }
  }
}

function populateAndShowModal(anime) {
  // Filter the links into separate categories
  const streamingLinks = anime.externalLinks.filter(link => STREAMING_SITES.includes(link.site));
  const socialLinks = anime.externalLinks.filter(link => SOCIAL_SITES.includes(link.site));
  const officialSite = anime.externalLinks.find(link => link.site === "Official Site");

  modalBody.innerHTML = `
    <h2>${anime.title.romaji}</h2>
    <img src="${anime.coverImage.large}" alt="${anime.title.romaji} cover" style="max-width: 200px; float: left; margin-right: 20px; border-radius: 8px;">
    <p><strong>Score:</strong> ${anime.averageScore || "N/A"} / 100</p>
    <p><strong>Status:</strong> ${anime.status}</p>
    <p><strong>Episodes:</strong> ${anime.episodes || "N/A"}</p>
    <p><strong>Genres:</strong> ${anime.genres.join(", ")}</p>
    
    <div class="modal-links">
        <strong>Watch on:</strong><br>
        ${generateLinksHTML(streamingLinks)}
    </div>

    <div class="modal-links" style="margin-top: 10px;">
        <strong>Official & Social Links:</strong><br>
        ${officialSite ? generateLinksHTML([officialSite]) : ''}
        ${generateLinksHTML(socialLinks)}
    </div>

    <hr style="clear: both; border: none; margin-top: 10px;">
    <p>${anime.description}</p>
  `;
  modal.classList.add("active");
}

function hideModal() {
  modal.classList.remove("active");
}

function generateLinksHTML(links) {
  if (!links || links.length === 0) {
    return "<span>N/A</span>";
  }
  return links
    .map(
      (link) => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer">
          ${link.icon ? `<img src="${link.icon}" alt="">` : ''}
          ${link.site}
        </a>`
    )
    .join("");
}