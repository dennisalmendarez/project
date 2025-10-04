// src/js/main.js
import "../css/style.css"; // CORRECTED PATH
import { fetchAnimeById } from "./api.js";
import { renderAnimeCards, filterAnimeDisplay } from "./ui.js";

const animesToFetch = {
  "Ascendance of a Bookworm": 108268,
  "Sword Art Online": 11757,
  "Twin Star Exorcists": 21499,
  "GOSICK": 8425,
  "Demon Slayer": 101922,
  "Spy X Family": 140960,
  "Solo Leveling": 151807,
  "That Time I Got Reincarnated as a Slime": 101280,
  "Black Clover": 97940,
  "Clannad": 2167,
};

async function initializeApp() {
  const fetchPromises = Object.values(animesToFetch).map((id) =>
    fetchAnimeById(id)
  );
  const animeList = await Promise.all(fetchPromises);
  renderAnimeCards(animeList.filter(Boolean));
  document.querySelector("#anime").addEventListener("change", (event) => {
    filterAnimeDisplay(event.target.value);
  });
}

initializeApp();