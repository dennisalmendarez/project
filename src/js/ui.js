// src/ui.js

// Renders all the anime cards to the page
export function renderAnimeCards(animeList) {
  const animeContainer = document.getElementById("selection");
  animeContainer.innerHTML = ""; // Clear previous content

  animeList.forEach((animeData) => {
    const anime = animeData.data.Media;
    if (anime) {
      const card = createAnimeCard(anime);
      animeContainer.appendChild(card);
    }
  });
}

// Creates a single anime card element
function createAnimeCard(anime) {
  const animeInfoDiv = document.createElement("div");
  animeInfoDiv.classList.add("anime-info");
  animeInfoDiv.dataset.animeId = anime.id; // Set data attribute for filtering

  // Sanitize description to prevent HTML injection
  const cleanDescription = anime.description.replace(/<br\s*\/?>/gi, " ");

  animeInfoDiv.innerHTML = `
        <h3>${anime.title.romaji}</h3>
        <img src="${anime.coverImage.large}" alt="${anime.title.romaji} cover">
        <p>
            <strong>Score:</strong> ${anime.averageScore} / 100<br>
            <strong>Genres:</strong> ${anime.genres.join(", ")}<br>
            <strong>Episodes:</strong> ${anime.episodes}<br>
        </p>
        <p class="description">${cleanDescription.substring(0, 150)}...</p>
    `;
  return animeInfoDiv;
}

// Filters which cards are visible based on the dropdown
export function filterAnimeDisplay(selectedAnimeId) {
  const animeElements = document.querySelectorAll(".anime-info");
  animeElements.forEach((animeElement) => {
    const animeId = animeElement.dataset.animeId;
    if (animeId === selectedAnimeId || selectedAnimeId === "all") {
      animeElement.style.display = "block";
    } else {
      animeElement.style.display = "none";
    }
  });
}
