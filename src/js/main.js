// src/js/main.js
import "../css/style.css";
import { fetchTopAnime } from "./api.js";
import { renderAnimeCards, initializeUIEventListeners } from "./ui.js";

// Main function to initialize the application
async function initializeApp() {
  // Fetch the top 100 trending anime in a single API call
  const topAnimeList = await fetchTopAnime(1, 100);

  // Render the cards with the fetched data
  renderAnimeCards(topAnimeList);

  // Set up all the event listeners (for the modal)
  initializeUIEventListeners();
}

// Start the application
initializeApp();