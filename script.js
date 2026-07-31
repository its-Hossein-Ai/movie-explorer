// DOM Elements
const moviesContainer = document.getElementById("moviesContainer");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const emptyState = document.getElementById("emptyState");
const detailsModal = document.getElementById("detailsModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

// Variables
const API_KEY = "6029522e90a963e633f95e1ed416ae03";
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
let allMovies = [];
let favoriteMovies = [];
let currentDisplayedMovies = [];

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
  hideError();
  hideEmptyState();
}

function hideLoading() {
  loadingState.style.display = "none";
}

function showError() {
  errorState.style.display = "block";
}

function hideError() {
  errorState.style.display = "none";
}

function createMovieCard(movie) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "";

  const favClass = isFavorite(movie.id) ? "is-active" : "";

  return `
    <article class="movie-card">
      <img class="poster" src="${posterUrl}" alt="${movie.title}">
      <div class="card-body">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span class="rating">⭐ ${movie.vote_average}</span>
          <span class="release-date">${movie.release_date}</span>
        </div>
        <button class="btn-details" data-id="${movie.id}">View Details</button>
        <button class="fav-btn ${favClass}" data-id="${movie.id}">♥</button>
      </div>
    </article>
  `;
}

function renderMovies(movies) {
  if (movies.length === 0) {
    moviesContainer.innerHTML = "";
    showEmptyState();
    return;
  }

  hideEmptyState();
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
    renderMovies(allMovies);
    hideEmptyState();
    hideError();
    return;
  }

  showLoading();
  hideEmptyState();

  const results = await searchMovies(query);

  allMovies = results;

  renderMovies(allMovies);

  hideLoading();
}

function getDetailsUrl(movieId) {
  return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
}

async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(getDetailsUrl(movieId));

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function createDetailsHTML(movie) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "";

  const genres = movie.genres.map((genre) => genre.name).join(", ");
  const runtime = movie.runtime ? `${movie.runtime} min` : "N/A";

  return `
    <img class="modal-poster" src="${posterUrl}" alt="${movie.title}">
    <h2>${movie.title}</h2>
    <p class="modal-overview">${movie.overview}</p>
    <div class="modal-meta">
      <span>⭐ ${movie.vote_average}</span>
      <span>${movie.release_date}</span>
      <span>${runtime}</span>
    </div>
    <p class="modal-genres">${genres}</p>
  `;
}

async function openMovieDetails(movieId) {
  detailsModal.hidden = false;
  modalBody.innerHTML = "<p>Loading...</p>";

  const movie = await fetchMovieDetails(movieId);
  console.log(movie);

  if (!movie) {
    modalBody.innerHTML = "<p>Failed to load movie details.</p>";
    return;
  }

  modalBody.innerHTML = createDetailsHTML(movie);
}

function isFavorite(movieId) {
  return favoriteMovies.some((movie) => movie.id === Number(movieId));
}

function addFavorite(movie) {
  favoriteMovies.push(movie);
}

function removeFavorite(movieId) {
  favoriteMovies = favoriteMovies.filter(
    (movie) => movie.id !== Number(movieId),
  );
}

function toggleFavorite(movieId, movie) {
  if (isFavorite(movieId)) {
    removeFavorite(movieId);
  } else {
    addFavorite(movie);
  }

  saveFavorites();
}

function updateFavoriteButton(button, movieId) {
  if (isFavorite(movieId)) {
    button.classList.add("is-active");
  } else {
    button.classList.remove("is-active");
  }
}

function saveFavorites() {
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
}

function loadFavorites() {
  try {
    const stored = localStorage.getItem("favoriteMovies");

    if (stored) {
      favoriteMovies = JSON.parse(stored);
    }
  } catch (error) {
    console.error(error);
    favoriteMovies = [];
  }
}

// Event Listener
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

moviesContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-details")) {
    const movieId = event.target.dataset.id;
    openMovieDetails(movieId);
  }

  if (event.target.classList.contains("fav-btn")) {
    const movieId = event.target.dataset.id;
    const movie = allMovies.find((m) => m.id === Number(movieId));

    toggleFavorite(movieId, movie);
    updateFavoriteButton(event.target, movieId);
  }
});

closeModalBtn.addEventListener("click", function () {
  detailsModal.hidden = true;
});

detailsModal.addEventListener("click", function (event) {
  if (event.target === detailsModal) {
    detailsModal.hidden = true;
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    detailsModal.hidden = true;
  }
});

// Initialize App
async function initApp() {
  loadFavorites();

  showLoading();

  const movies = await fetchMovies();
  allMovies = movies;
  currentDisplayedMovies = movies;

  if (movies.length > 0) {
    renderMovies(movies);
  } else {
    showEmptyState();
  }

  hideLoading();
}
initApp();
