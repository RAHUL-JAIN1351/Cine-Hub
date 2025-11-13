

async function apiGet(endpoint) {
  const res = await fetch(`${apiBase}${endpoint}`);
  if (!res.ok) throw new Error(`Failed GET ${endpoint}`);
  return res.json();
}

async function apiPost(endpoint, data) {
  const res = await fetch(`${apiBase}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function apiDelete(endpoint) {
  await fetch(`${apiBase}${endpoint}`, { method: "DELETE" });
}


function createMovieCard(movie, favIds) {
  const isFav = favIds.includes(movie.id);
  const div = document.createElement("div");
  div.className = "movie-card";
  div.innerHTML = `
    <div class="movie-poster">
      <img src="${movie.poster}" alt="${movie.title}">
      <button class="fav-btn ${isFav ? "active" : ""}" title="${isFav ? "Remove from" : "Add to"} favourites">
        ${isFav ? "❤️" : "🤍"}
      </button>
    </div>
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <div class="meta">${movie.category} • ⭐ ${movie.rating} • ${movie.year}</div>
    </div>
  `;
  observer.observe(div);

  div.querySelector(".fav-btn").addEventListener("click", async (e) => {
    e.stopPropagation();
    if (div.querySelector(".fav-btn").classList.contains("active")) {
      await removeFavourite(movie.id);
      e.target.classList.remove("active");
      e.target.textContent = "🤍";
    } else {
      await addFavourite(movie);
      e.target.classList.add("active");
      e.target.textContent = "❤️";
    }
  });

  return div;
}

async function addFavourite(movie) {
  const favs = await apiGet("/favourites");
  if (!favs.find((f) => f.id === movie.id)) await apiPost("/favourites", movie);
}

async function removeFavourite(id) {
  const favs = await apiGet("/favourites");
  const target = favs.find((f) => f.id === id);
  if (target) await apiDelete(`/favourites/${target.id}`);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.addEventListener("DOMContentLoaded", async () => {
  const moviesContainer = document.getElementById("movies-container");
  const emptyState = document.getElementById("empty-state");

  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters(); // re-render all movies
  });


  const filterCategory = document.getElementById("filter-category");
  const sortBy = document.getElementById("sort-by");
  let allMovies = [], favourites = [];

  window.addEventListener("scroll", () => {
    document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 10);
  });

  // Carousel setup
  const carouselContainer = document.getElementById("carousel-container");
  const carouselImages = [
    "https://webneel.com/wnet/file/images/11-16/8-xmen-movie-poster-design.jpg",
    "https://i0.wp.com/teaser-trailer.com/wp-content/uploads/2019/01/Polar-new-banner.jpg?ssl=1",
    "https://collider.com/wp-content/uploads/inception_movie_poster_banner_04.jpg"
  ];

  carouselImages.forEach((url, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    if (i === 0) slide.classList.add("active");
    slide.innerHTML = `<img src="${url}" alt="Slide ${i + 1}">`;
    carouselContainer.appendChild(slide);
  });

  let current = 0;

  const slides = Array.from(carouselContainer.querySelectorAll(".carousel-slide"));
  function changeSlide(next = 1) {
    slides[current].classList.remove("active");
    current = (current + next + slides.length) % slides.length;
    slides[current].classList.add("active");
  }


  document.getElementById("prev").onclick = () => changeSlide(-1);
  document.getElementById("next").onclick = () => changeSlide(1);
  setInterval(() => changeSlide(1), 5000);

  try {
    allMovies = await apiGet("/movies");
    favourites = await apiGet("/favourites");
    renderMovies(allMovies);
    populateFilter(allMovies);
  } catch (err) {
    console.error(err);
    emptyState.classList.remove("hidden");
    emptyState.textContent = "Failed to load movies ❌";
  }

  function renderMovies(list) {
    moviesContainer.innerHTML = "";
    if (!list.length) {
      emptyState.classList.remove("hidden");
      return;
    }
    emptyState.classList.add("hidden");
    const favIds = favourites.map((f) => f.id);
    list.forEach((m) => moviesContainer.appendChild(createMovieCard(m, favIds)));
  }

  function populateFilter(list) {
    const cats = [...new Set(list.map((m) => m.category))];
    filterCategory.innerHTML =
      `<option value="">All genres</option>` +
      cats.map((c) => `<option value="${c}">${c}</option>`).join("");
  }

  function applyFilters() {
    let filtered = [...allMovies];
    const q = (searchInput.value || "").toLowerCase();
    const cat = filterCategory.value;
    const sort = sortBy.value;

    if (q) filtered = filtered.filter((m) => m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    if (cat) filtered = filtered.filter((m) => m.category === cat);
    if (sort === "rating-desc") filtered.sort((a, b) => b.rating - a.rating);
    if (sort === "rating-asc") filtered.sort((a, b) => a.rating - b.rating);
    if (sort === "year-desc") filtered.sort((a, b) => b.year - a.year);
    if (sort === "year-asc") filtered.sort((a, b) => a.year - b.year);

    renderMovies(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  filterCategory.addEventListener("change", applyFilters);
  sortBy.addEventListener("change", applyFilters);
});
