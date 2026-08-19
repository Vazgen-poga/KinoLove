// script.js
// Общая логика для всех страниц: index.html, movie.html, movies.html, player.html

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

/* ---------- Карточка фильма (используется в сетках) ---------- */

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

function renderGrid(elId, list) {
  const grid = document.getElementById(elId);
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

/* ---------- Общий рендер карточки-описания фильма ---------- */
/* Используется и на главной (для фильма №1), и на movie.html (для любого id) */

function renderDetailHTML(movie, watchHref) {
  return `
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
      <a class="btn btn--marquee" href="${watchHref}">▶ Смотреть</a>
    </div>
  `;
}

/* ---------- Главная страница (index.html) — один главный фильм ---------- */

function initHomePage() {
  const container = document.getElementById("home-detail");
  if (!container) return; // мы не на главной странице

  const mainMovie = MOVIES[0];
  if (!mainMovie) {
    container.innerHTML = `<p class="empty-state">Фильм ещё не добавлен. Заполните movies.js.</p>`;
    return;
  }

  document.title = `${mainMovie.title} — Кинозал`;
  container.innerHTML = renderDetailHTML(mainMovie, `player.html?id=${mainMovie.id}`);

  // Раздел "Другие фильмы" — появляется сам, когда в movies.js больше одного фильма
  const others = MOVIES.slice(1);
  const otherSection = document.getElementById("other-movies");
  if (otherSection) {
    if (others.length > 0) {
      otherSection.style.display = "";
      renderGrid("other-grid", others);
    } else {
      otherSection.style.display = "none";
    }
  }
}

/* ---------- Каталог всех фильмов (movies.html) ---------- */

function initCatalogPage() {
  const grid = document.getElementById("movie-grid");
  if (!grid) return; // мы не на странице каталога

  const searchInput = document.getElementById("search-input");
  const filterBar = document.getElementById("genre-filters");

  let activeGenre = "Все";

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
    renderGrid("movie-grid", filtered);
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

  renderGrid("movie-grid", MOVIES);
}

/* ---------- Страница отдельного фильма (movie.html?id=) ---------- */

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
  container.innerHTML = renderDetailHTML(movie, `player.html?id=${movie.id}`);

  renderRelated(movie);
}

function renderRelated(movie) {
  const relatedSection = document.getElementById("related-section");
  const relatedGrid = document.getElementById("related-grid");
  if (!relatedGrid) return;
  const related = MOVIES.filter(
    (m) => m.id !== movie.id && m.genre.some((g) => movie.genre.includes(g))
  ).slice(0, 4);
  const list = related.length > 0 ? related : MOVIES.filter((m) => m.id !== movie.id).slice(0, 4);

  if (list.length === 0) {
    if (relatedSection) relatedSection.style.display = "none";
    return;
  }
  if (relatedSection) relatedSection.style.display = "";
  relatedGrid.innerHTML = list.map(movieCardHTML).join("");
}

/* ---------- Плеер (player.html?id=) ---------- */

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
  initHomePage();
  initCatalogPage();
  initMoviePage();
  initPlayerPage();
});
