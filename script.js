// script.js
// Общая логика для всех страниц: index.html, movie.html, player.html

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function findMovie(id) {
  return MOVIES.find((m) => String(m.id) === String(id));
}

function posterStyle(movie) {
  if (movie.image) {
    return `background-image:url('${movie.image}');background-size:cover;background-position:center;`;
  }
  return `background-image:linear-gradient(160deg, ${movie.poster.from}, ${movie.poster.to});`;
}

function formatDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h} ч ${m} мин`;
}

/* ---------- Карточка фильма (используется на index.html) ---------- */

function movieCardHTML(movie) {
  return `
    <a class="card" href="movie.html?id=${movie.id}">
      <div class="card__poster" style="${posterStyle(movie)}">
        <span class="card__icon">${movie.poster.icon}</span>
        <span class="card__rating">★ ${movie.rating}</span>
      </div>
      <div class="card__body">
        <h3 class="card__title">${movie.title}</h3>
        <p class="card__meta">${movie.year} · ${movie.genre.join(", ")}</p>
      </div>
    </a>
  `;
}

function renderGrid(list) {
  const grid = document.getElementById("movie-grid");
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = `<p class="empty-state">Ничего не найдено. Попробуйте другой запрос или жанр.</p>`;
    return;
  }
  grid.innerHTML = list.map(movieCardHTML).join("");
}

function allGenres() {
  const set = new Set();
  MOVIES.forEach((m) => m.genre.forEach((g) => set.add(g)));
  return Array.from(set).sort();
}

function initIndexPage() {
  const grid = document.getElementById("movie-grid");
  if (!grid) return; // мы не на главной странице

  const searchInput = document.getElementById("search-input");
  const filterBar = document.getElementById("genre-filters");

  let activeGenre = "Все";

  // строим кнопки жанров
  const genres = ["Все", ...allGenres()];
  filterBar.innerHTML = genres
    .map(
      (g) =>
        `<button class="filter-btn${g === "Все" ? " is-active" : ""}" data-genre="${g}">${g}</button>`
    )
    .join("");

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = MOVIES.filter((m) => {
      const matchesGenre = activeGenre === "Все" || m.genre.includes(activeGenre);
      const matchesQuery = m.title.toLowerCase().includes(query);
      return matchesGenre && matchesQuery;
    });
    renderGrid(filtered);
  }

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeGenre = btn.dataset.genre;
    applyFilters();
  });

  searchInput.addEventListener("input", applyFilters);

  // рендер стартового состояния + случайный фильм в афише (hero)
  renderGrid(MOVIES);
  const featured = MOVIES[Math.floor(Math.random() * MOVIES.length)];
  const hero = document.getElementById("hero");
  if (hero) {
    hero.style.backgroundImage = `linear-gradient(0deg, rgba(18,16,14,1) 0%, rgba(18,16,14,0.55) 60%, rgba(18,16,14,0.25) 100%), linear-gradient(160deg, ${featured.poster.from}, ${featured.poster.to})`;
    document.getElementById("hero-title").textContent = featured.title;
    document.getElementById("hero-desc").textContent = featured.description;
    document.getElementById("hero-meta").textContent = `${featured.year} · ${featured.genre.join(", ")} · ${formatDuration(featured.duration)} · ★ ${featured.rating}`;
    document.getElementById("hero-link").href = `movie.html?id=${featured.id}`;
  }
}

/* ---------- Страница фильма ---------- */

function initMoviePage() {
  const container = document.getElementById("movie-detail");
  if (!container) return; // мы не на странице фильма

  const id = getQueryParam("id");
  const movie = findMovie(id);

  if (!movie) {
    container.innerHTML = `<p class="empty-state">Фильм не найден. <a href="index.html">Вернуться на главную</a></p>`;
    return;
  }

  document.title = `${movie.title} — Кинозал`;

  container.innerHTML = `
    <div class="detail__poster" style="${posterStyle(movie)}">
      <span class="card__icon card__icon--big">${movie.poster.icon}</span>
    </div>
    <div class="detail__info">
      <h1 class="detail__title">${movie.title}</h1>
      <p class="detail__meta">${movie.year} · ${movie.country} · ${formatDuration(movie.duration)} · ★ ${movie.rating}</p>
      <div class="detail__genres">
        ${movie.genre.map((g) => `<span class="tag">${g}</span>`).join("")}
      </div>
      <p class="detail__desc">${movie.description}</p>
      <a class="btn btn--marquee" href="player.html?id=${movie.id}">▶ Смотреть</a>
    </div>
  `;

  renderRelated(movie);
}

function renderRelated(movie) {
  const relatedGrid = document.getElementById("related-grid");
  if (!relatedGrid) return;
  const related = MOVIES.filter(
    (m) => m.id !== movie.id && m.genre.some((g) => movie.genre.includes(g))
  ).slice(0, 4);
  const list = related.length > 0 ? related : MOVIES.filter((m) => m.id !== movie.id).slice(0, 4);
  relatedGrid.innerHTML = list.map(movieCardHTML).join("");
}

/* ---------- Плеер ---------- */

function initPlayerPage() {
  const video = document.getElementById("player-video");
  if (!video) return; // мы не на странице плеера

  const id = getQueryParam("id");
  const movie = findMovie(id);
  const titleEl = document.getElementById("player-title");
  const backLink = document.getElementById("player-back");

  if (!movie) {
    titleEl.textContent = "Фильм не найден";
    video.remove();
    return;
  }

  document.title = `${movie.title} — Просмотр`;
  titleEl.textContent = movie.title;
  backLink.href = `movie.html?id=${movie.id}`;
  video.src = movie.video;
}

/* ---------- Инициализация ---------- */

document.addEventListener("DOMContentLoaded", () => {
  initIndexPage();
  initMoviePage();
  initPlayerPage();
});
