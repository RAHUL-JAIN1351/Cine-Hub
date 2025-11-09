
const carouselImages = [
    "https://lh6.googleusercontent.com/proxy/MX3D4QatCD48FMfsynnWIAs4g1JT8iTM4K-05xetNMuZ3h5JmVuiRcnRo2BN86tEPuD9KFOtAPpwsZPQKXjwG19oAwaJqxTKvzChZV_V_7ostQ",

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl9BcgXCBK15cXryD_jOe-XtQ86nZC0m2EfQ&s",

    "https://webneel.com/wnet/file/images/11-16/8-xmen-movie-poster-design.jpg",

    "https://i0.wp.com/teaser-trailer.com/wp-content/uploads/2019/01/Polar-new-banner.jpg?ssl=1",

    "https://collider.com/wp-content/uploads/inception_movie_poster_banner_04.jpg"
]

let currentSlide = 0;
let previousSlide = 0

let allMovies = []
let moviesContainer = document.getElementById('movies-container');


const carouselContainer = document.getElementById("carousel-container");

function initCarousel(){
    carouselContainer.innerHTML = "";
    carouselImages.forEach((imageurl,index) =>{
        const slide = document.createElement('div');    
        slide.className = "carousel-slide";

        if (index === 0){
            slide.classList.add('active');
        }
        const img = document.createElement('img');
        img.classList.add('carousel-image');
        img.src = imageurl; 
        img.alt = `Slide ${index+1}`;
        slide.appendChild(img);
        carouselContainer.appendChild(slide);
    });
}

function updateCarousel(direction){
    const slides = document.querySelectorAll('.carousel-slide');

    slides.forEach((slide) =>{
        slide.classList.remove('active','to-left','to-right');
    });

    const prev = slides[previousSlide];
    const curr = slides[currentSlide];

    if (direction === -1){
        prev.classList.add('to-left');
    }
    else{
        prev.classList.add('to-right');
    }

    curr.classList.add('active');
}

function changeslide(direction){
    previousSlide = currentSlide;
    currentSlide = Math.abs(currentSlide + direction + carouselImages.length) % carouselImages.length;
    updateCarousel(direction);
}

async function loadMovies(){
    try{
        let response = await fetch('http://localhost:3000/movies');
        if(!response){
            console.error("Failed To Load Movies");
        }
        allMovies = await response.json();
        DisplayMovies();
    }
    catch(err){
        console.error(err);
    }
}

function autoNext(){
    currentSlide = (currentSlide + 1) % carouselImages.length;
    changeslide(+1);
}

function DisplayMovies(){
    if(!moviesContainer){
        console.error('Movie Container Not There');
        return
    }
    if(!allMovies || allMovies.length === 0){
        moviesContainer.innerHTML = '<p style="color:White;text-align:center;font-weight:bold;font-size:30px;"> No Movies Available! </p>';
        return
    }

    allMovies.forEach((movie) =>{
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="movie-poster">
                <img src=${movie.poster} alt=${movie.title} class="movie-poster-img" />
            </div>
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-year">${movie.year}</div>
                <div class="movie-category">${movie.category}</div>
                <div class="movie-rating">${movie.rating} ⭐</div>
            </div>
            <div class="movie-buttons">
                <button class="btn btn-favourite">❤️ Favourite</button>
                <button class="btn btn-cart">🛒 Cart</button>
            </div>
        `;
        moviesContainer.appendChild(card);
    });
}

setInterval(autoNext,5000);
initCarousel();
loadMovies();