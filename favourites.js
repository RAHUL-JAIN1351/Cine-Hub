document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("favourites-container");
  const empty = document.getElementById("empty-fav");

  try {
    const favs = await apiGet("/favourites");

    if (!favs.length) {
      empty.classList.remove("hidden");
      return;
    }

    // IMPORTANT FIX: hide the empty message
    empty.classList.add("hidden");

    favs.forEach((movie) => {
      const div = document.createElement("div");
      div.className = "movie-card visible";
      div.innerHTML = `
        <div class="movie-poster">
          <img src="${movie.poster}" alt="${movie.title}">
          <button class="fav-btn active" title="Remove from favourites">❤️</button>
        </div>
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <div class="meta">${movie.category} • ⭐ ${movie.rating} • ${movie.year}</div>
        </div>
      `;
      div.querySelector(".fav-btn").addEventListener("click", async () => {
        await apiDelete(`/favourites/${movie.id}`);
        div.remove();

        // Show empty msg if no items left
        if (!container.children.length) {
          empty.classList.remove("hidden");
        }
      });

      container.appendChild(div);
    });
  } catch (err) {
    empty.classList.remove("hidden");
    empty.textContent = "Error loading favourites ❌";
  }
});
