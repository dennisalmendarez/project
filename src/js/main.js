import "../css/style.css";
import { fetchTopAnime } from "./api.js";
import { renderAnimeCards, initializeUIEventListeners } from "./ui.js";

async function initializeApp() {
  const topAnimeList = await fetchTopAnime(1, 100);

  renderAnimeCards(topAnimeList);

  initializeUIEventListeners();
}

initializeApp();
