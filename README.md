# 🎬 Movie Explorer

A single-page movie discovery app built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no libraries. Browse popular movies, search by title, view full details, save favorites, and filter results, all backed by a live movie API.

This project was built as a step-by-step learning exercise to practice core JavaScript fundamentals: the DOM, events, the Fetch API, async/await, array methods, objects, error handling, and LocalStorage.

---

## Features

- **Browse popular movies** — fetched live from the API on page load
- **Search** — find movies by title, by clicking Search or pressing Enter
- **Movie details** — click "View Details" to open a modal with poster, overview, rating, release date, runtime, and genres
- **Favorites** — save/remove movies with a single click; persists across page refreshes
- **Filters** — All / Top Rated / Newest / Favorites
- **Loading, error, and empty states** — clear feedback while data loads or when something goes wrong
- **Responsive design** — usable on mobile, tablet, and desktop

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (Flexbox, Grid, media queries — dark theme)
- Vanilla JavaScript (ES6+, Fetch API, async/await)
- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
- Browser `localStorage` for persisting favorites

No build tools, no frameworks, no external JS libraries.

## Project Structure

```
Movie-Explorer/
│
├── index.html      # Page structure
├── style.css       # Styling and responsive layout
├── script.js       # App logic (fetching, rendering, search, filters, favorites)
└── images/         # (optional local assets)
```

## Getting Started

1. Clone or download this repository.
2. Get a free API key from [TMDB](https://www.themoviedb.org/settings/api) (requires a free account).
3. Open `script.js` and set your key:
   ```js
   const API_KEY = "YOUR_TMDB_API_KEY";
   ```
4. Open `index.html` in your browser — no server or build step required.

> ⚠️ **Note:** TMDB may be inaccessible from certain regions without a VPN.
> ⚠️ Don't commit your real API key to a public repository — remove or replace it before pushing.

## How It Works

- On load, the app fetches popular movies from TMDB and renders them as cards.
- Each movie card is generated dynamically from the API response — nothing is hardcoded in the HTML.
- Searching calls a different TMDB endpoint and re-renders the same card layout with the results.
- Clicking a card's "View Details" button fetches full details for that movie and displays them in a modal.
- Clicking the ❤️ button adds/removes a movie from favorites; the list is saved to `localStorage` as JSON, so it survives a page refresh.
- Filter buttons (All / Top Rated / Newest / Favorites) re-render the movie grid based on the selected criteria without a new page load.

## Possible Improvements

- Pagination / infinite scroll for search and popular results
- Debounce the search input instead of requiring Enter/click
- A dedicated backend to hide the API key in production
- Filter combined with active search results

---

Built as a learning project — feedback and suggestions welcome.
