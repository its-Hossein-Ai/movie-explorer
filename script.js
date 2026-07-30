// DOM Elements
const moviesContainer = document.getElementById("moviesContainer");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const emptyState = document.getElementById("emptyState");

// Variables
const API_KEY = "6029522e90a963e633f95e1ed416ae03";
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
let allMovies = [];

// Function
async function fetchMovies() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    showError();
    return [];
  }
}

function showLoading() {
  loadingState.style.display = "block";
  errorState.style.display = "none";
}

function hideLoading() {
  loadingState.style.display = "none";
}

function showError() {
  errorState.style.display = "block";
}

function createMovieCard(movie) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "";

  return `
    <article class="movie-card">
      <img class="poster" src="${posterUrl}" alt="${movie.title}">
      <div class="card-body">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span class="rating">⭐ ${movie.vote_average}</span>
          <span class="release-date">${movie.release_date}</span>
        </div>
        <button class="btn-details">View Details</button>
        <button class="fav-btn">♥</button>
      </div>
    </article>
  `;
}

function renderMovies(movies) {
  moviesContainer.innerHTML = movies.map(createMovieCard).join("");
}

function getSearchUrl(query) {
  return `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
}

async function searchMovies(query) {
  try {
    const response = await fetch(getSearchUrl(query));

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    showError();
    return [];
  }
}

function showEmptyState() {
  emptyState.style.display = "block";
}

function hideEmptyState() {
  emptyState.style.display = "none";
}

async function handleSearch() {
  const query = searchInput.value.trim();

  if (query === "") {
    return;
  }

  showLoading();
  hideEmptyState();

  const results = await searchMovies(query);

  if (results.length === 0) {
    moviesContainer.innerHTML = "";
    showEmptyState();
  } else {
    renderMovies(results);
  }

  hideLoading();
}

// Event Listener
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});
// Initialize App
async function initApp() {
  showLoading();

  const movies = await fetchMovies();
  allMovies = movies;

  renderMovies(allMovies);
  hideLoading();
}
initApp();
