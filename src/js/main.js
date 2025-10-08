import "../css/style.css";
import { fetchAnime, fetchAllGenres } from "./api.js";
import {
  renderAnimeCards,
  initializeUIEventListeners,
  displayGenres,
  renderTop10,
} from "./ui.js";

let currentSort = "TRENDING_DESC";
let allAnime = [];

async function initializeApp() {
  await loadAnime();
  const genres = await fetchAllGenres();
  // Filter out unwanted genres before displaying
  const filteredGenres = genres.filter((genre) => genre !== "Hentai");
  displayGenres(filteredGenres);
  initializeUIEventListeners(handleFilterChange);
  document
    .getElementById("trendingTitle")
    .addEventListener("click", () => switchView("TRENDING_DESC"));
  document
    .getElementById("topTitle")
    .addEventListener("click", () => switchView("SCORE_DESC"));
  document.getElementById("top10Button").addEventListener("click", showTop10);
  document
    .getElementById("favoritesButton")
    .addEventListener("click", showFavorites);
  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);

  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const atBottom =
      window.innerHeight + window.pageYOffset >=
      document.body.offsetHeight - 10;

    if (scrollTop > lastScrollTop) {
      // Scrolling Down
      if (scrollTop > header.offsetHeight) {
        header.style.top = `-${header.offsetHeight}px`;
      }
      footer.style.bottom = atBottom ? "0" : `-${footer.offsetHeight}px`;
    } else {
      // Scrolling Up
      header.style.top = "0";
      footer.style.bottom = "0";
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

async function loadAnime(sort = currentSort, search = null, genres = []) {
  const animeContainer = document.getElementById("selection");
  animeContainer.innerHTML = "<div class='loader'>Loading Anime...</div>";
  allAnime = await fetchAnime(1, 100, sort, search, genres);
  renderAnimeCards(allAnime);
}

function switchView(sort) {
  currentSort = sort;
  document
    .getElementById("trendingTitle")
    .classList.toggle("active", sort === "TRENDING_DESC");
  document
    .getElementById("topTitle")
    .classList.toggle("active", sort !== "TRENDING_DESC");
  document.getElementById("searchInput").value = "";
  const checkboxes = document.querySelectorAll("#genreFilters input:checked");
  checkboxes.forEach((cb) => (cb.checked = false));
  loadAnime(sort);
}

function handleFilterChange() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const selectedGenres = Array.from(
    document.querySelectorAll("#genreFilters input:checked"),
  ).map((el) => el.value);

  let filteredAnime = allAnime;

  if (search) {
    filteredAnime = filteredAnime.filter((anime) =>
      anime.title.romaji.toLowerCase().includes(search),
    );
  }

  if (selectedGenres.length > 0) {
    filteredAnime = filteredAnime.filter((anime) =>
      selectedGenres.every((genre) => anime.genres.includes(genre)),
    );
  }

  renderAnimeCards(filteredAnime);
}

function handleSearch() {
  handleFilterChange();
}

async function showTop10() {
  const trendingAnime = await fetchAnime(1, 10, "TRENDING_DESC");
  renderTop10(trendingAnime);
}

function showFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length === 0) {
    alert("You have no favorite anime yet!");
    return;
  }
  document.getElementById("trendingTitle").classList.remove("active");
  document.getElementById("topTitle").classList.remove("active");
  renderAnimeCards(favorites);
}

initializeApp();
