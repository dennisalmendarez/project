import { fetchAnimeCharacters } from "./api.js";

let fullAnimeList = [];
let favorites = new Set(
  JSON.parse(localStorage.getItem("favorites"))?.map((f) => f.id) || [],
);

const modal = document.getElementById("animeModal");
const modalBody = document.getElementById("modalBody");
const closeButton = document.querySelector(".close-button");
const animeContainer = document.getElementById("selection");

const STREAMING_SITES = [
  "Crunchyroll",
  "Hulu",
  "Netflix",
  "Funimation",
  "HIDIVE",
  "Prime Video",
  "VRV",
  "YouTube",
];
const SOCIAL_SITES = ["Instagram", "Twitter", "TikTok", "Facebook"];

export function initializeUIEventListeners(filterCallback) {
  animeContainer.addEventListener("click", handleCardClick);
  closeButton.addEventListener("click", hideModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });
  document
    .getElementById("genreFilters")
    .addEventListener("change", filterCallback);
}

export function renderAnimeCards(animeList) {
  fullAnimeList = animeList;
  animeContainer.innerHTML = "";

  if (animeList.length === 0) {
    animeContainer.innerHTML =
      "<p class='no-results'>No anime found matching your criteria.</p>";
    return;
  }

  animeList.forEach((anime) => {
    if (anime) {
      const card = createAnimeCard(anime);
      animeContainer.appendChild(card);
    }
  });
}

export function renderTop10(animeList) {
  fullAnimeList = animeList;
  animeContainer.innerHTML = "";
  document.getElementById("trendingTitle").classList.add("active");
  document.getElementById("topTitle").classList.remove("active");

  if (animeList.length === 0) {
    animeContainer.innerHTML =
      "<p class='no-results'>Could not load Top 10.</p>";
    return;
  }

  const top10Container = document.createElement("div");
  top10Container.className = "top-10-container";

  animeList.forEach((anime) => {
    const animeEl = document.createElement("div");
    animeEl.className = "top-10-item anime-info";
    animeEl.dataset.animeId = anime.id;
    const cleanDescription = anime.description
      ? anime.description.replace(/<br\s*\/?>/gi, " ")
      : "No description available.";

    animeEl.innerHTML = `
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji} cover">
            <div class="top-10-content">
                <h3>${anime.title.romaji}</h3>
                <p><strong>Score:</strong> ${anime.averageScore || "N/A"} / 100</p>
                <p class="description">${cleanDescription.substring(0, 250)}...</p>
            </div>
        `;
    top10Container.appendChild(animeEl);
  });
  animeContainer.appendChild(top10Container);
}

function createAnimeCard(anime) {
  const animeInfoDiv = document.createElement("div");
  animeInfoDiv.classList.add("anime-info");
  animeInfoDiv.dataset.animeId = anime.id;
  const isFavorite = favorites.has(anime.id);

  animeInfoDiv.innerHTML = `
    <div class="card-header">
        <h3>${anime.title.romaji}</h3>
        <span class="favorite-icon" data-anime-id="${anime.id}">${isFavorite ? "❤️" : "🤍"}</span>
    </div>
    <img src="${anime.coverImage.large}" alt="${anime.title.romaji} cover">
    <p>
        <strong>Score:</strong> ${anime.averageScore || "N/A"} / 100<br>
        <strong>Genres:</strong> ${anime.genres.join(", ")}<br>
        <strong>Episodes:</strong> ${anime.episodes || "N/A"}<br>
    </p>
    `;
  return animeInfoDiv;
}

function handleCardClick(event) {
  if (event.target.classList.contains("favorite-icon")) {
    toggleFavorite(event);
    return;
  }

  const card = event.target.closest(".anime-info");
  if (card && card.dataset.animeId) {
    const animeId = parseInt(card.dataset.animeId, 10);
    const animeData =
      fullAnimeList.find((item) => item.id === animeId) ||
      JSON.parse(localStorage.getItem("favorites"))?.find(
        (item) => item.id === animeId,
      );
    if (animeData) {
      populateAndShowModal(animeData);
    }
  }
}

function toggleFavorite(event) {
  const animeId = parseInt(event.target.dataset.animeId, 10);
  const animeData = fullAnimeList.find((item) => item.id === animeId);
  let favsFromStorage = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.has(animeId)) {
    favorites.delete(animeId);
    favsFromStorage = favsFromStorage.filter((fav) => fav.id !== animeId);
    event.target.textContent = "🤍";
  } else {
    favorites.add(animeId);
    favsFromStorage.push(animeData);
    event.target.textContent = "❤️";
  }
  localStorage.setItem("favorites", JSON.stringify(favsFromStorage));
}

async function populateAndShowModal(anime) {
  const streamingLinks = anime.externalLinks.filter((link) =>
    STREAMING_SITES.includes(link.site),
  );
  const socialLinks = anime.externalLinks.filter((link) =>
    SOCIAL_SITES.includes(link.site),
  );
  const officialSite = anime.externalLinks.find(
    (link) => link.site === "Official Site",
  );
  const isFavorite = favorites.has(anime.id);

  modalBody.innerHTML = `
    <h2>${anime.title.romaji}</h2>
    <button class="favorite-btn-modal" data-anime-id="${anime.id}">${isFavorite ? "Remove from Favorites ❤️" : "Add to Favorites 🤍"}</button>
    <img src="${anime.coverImage.large}" alt="${anime.title.romaji} cover" style="max-width: 200px; float: left; margin-right: 20px; border-radius: 8px;">
    <p><strong>Score:</strong> ${anime.averageScore || "N/A"} / 100</p>
    <p><strong>Status:</strong> ${anime.status}</p>
    <p><strong>Episodes:</strong> ${anime.episodes || "N/A"}</p>
    <p><strong>Genres:</strong> ${anime.genres.join(", ")}</p>
    <div class="modal-links"><strong>Watch on:</strong><br>${generateLinksHTML(streamingLinks)}</div>
    <div class="modal-links" style="margin-top: 10px;"><strong>Official & Social Links:</strong><br>${officialSite ? generateLinksHTML([officialSite]) : ""} ${generateLinksHTML(socialLinks)}</div>
    <hr style="clear: both; border: none; margin-top: 10px;">
    <p class="synopsis">${anime.description}</p>
    <div id="characters-container"><h3>Loading characters...</h3></div>
  `;
  modal.classList.add("active");

  // Fetch and render characters after the modal is shown
  const characters = await fetchAnimeCharacters(anime.id);
  renderCharacters(characters);

  document
    .querySelector(".favorite-btn-modal")
    .addEventListener("click", () => {
      const icon = document.querySelector(
        `.favorite-icon[data-anime-id="${anime.id}"]`,
      );
      if (icon) {
        icon.click();
      } else {
        let favsFromStorage =
          JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.has(anime.id)) {
          favorites.delete(anime.id);
          favsFromStorage = favsFromStorage.filter(
            (fav) => fav.id !== anime.id,
          );
        } else {
          favorites.add(anime.id);
          const animeToAdd = fullAnimeList.find((a) => a.id === anime.id);
          if (animeToAdd) favsFromStorage.push(animeToAdd);
        }
        localStorage.setItem("favorites", JSON.stringify(favsFromStorage));
      }
      populateAndShowModal(anime);
    });
}

function renderCharacters(characters) {
  const container = document.getElementById("characters-container");
  if (!characters || characters.length === 0) {
    container.innerHTML = "<h3>Character information not available.</h3>";
    return;
  }

  // Get main characters to avoid clutter, limit to 6
  const mainCharacters = characters.filter(c => c.role === "Main").slice(0, 6);

  const charactersHTML = mainCharacters.map(charData => {
    const character = charData.character;
    // Find the Japanese voice actor
    const voiceActor = charData.voice_actors.find(va => va.language === "Japanese");

    return `
      <div class="character-card">
        <img src="${character.images.webp.image_url}" alt="${character.name}">
        <p><strong>${character.name}</strong></p>
        ${voiceActor ? `<p class="va-name">VA: ${voiceActor.person.name}</p>` : ""}
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <h3>Main Characters</h3>
    <div class="characters-grid">${charactersHTML}</div>
  `;
}

function hideModal() {
  modal.classList.remove("active");
}

function generateLinksHTML(links) {
  if (!links || links.length === 0) return "<span>N/A</span>";
  return links
    .map(
      (link) =>
        `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.icon ? `<img src="${link.icon}" alt="">` : ""} ${link.site}</a>`,
    )
    .join("");
}

export function displayGenres(genres) {
  const container = document.getElementById("genreFilters");
  container.innerHTML = "<strong>Filter by Genre:</strong><br>";
  genres.forEach((genre) => {
    const checkbox = document.createElement("label");
    checkbox.innerHTML = `<input type="checkbox" value="${genre}"> ${genre}`;
    container.appendChild(checkbox);
  });
}
