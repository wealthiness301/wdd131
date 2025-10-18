// scripts/main.js
// Uses template literals for building HTML output, DOM manipulation, localStorage, lazy-loading.

async function fetchRecipes() {
    const res = await fetch('data/recipes.json');
    const data = await res.json();
    const user = JSON.parse(localStorage.getItem('userRecipes') || '[]');
    // user-submitted recipes appear first
    return [...user, ...data];
}

function createCardHTML(r) {
    return `
    <article class="card" data-id="${r.id}">
      <img data-src="${r.image}" alt="${r.title}" loading="lazy" class="lazy">
      <div class="card-content">
        <h3>${r.title}</h3>
        <div class="meta">${r.time} • ${r.difficulty}</div>
        <p class="small">${r.summary}</p>
        <p><a class="btn" href="recipes.html#${r.id}">View Recipe</a></p>
      </div>
    </article>
  `;
}

function renderRecipes(list, container) {
    container.innerHTML = list.map(r => createCardHTML(r)).join('');
    initLazyLoading();
}

function initLazyLoading() {
    const images = document.querySelectorAll('img.lazy');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const img = e.target;
                    img.src = img.dataset.src || 'images/hero.webp';
                    img.classList.remove('lazy');
                    obs.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });
        images.forEach(img => io.observe(img));
    } else {
        images.forEach(img => { img.src = img.dataset.src || 'images/hero.webp'; });
    }
}

// favorites stored in localStorage as array of ids
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function saveFavorite(id) {
    const fav = getFavorites();
    if (!fav.includes(id)) { fav.push(id); localStorage.setItem('favorites', JSON.stringify(fav)); }
}

function removeFavorite(id) {
    let fav = getFavorites();
    fav = fav.filter(x => x !== id);
    localStorage.setItem('favorites', JSON.stringify(fav));
}

function isFavorite(id) {
    return getFavorites().includes(id);
}

async function renderRecipeDetail(id) {
    const list = await fetchRecipes();
    const r = list.find(x => x.id === id);
    if (!r) return;
    const target = document.getElementById('recipe-detail');
    if (!target) return;
    target.innerHTML = `
    <div class="recipe-detail">
      <div class="recipe-img card"><img data-src="${r.image}" alt="${r.title}" class="lazy"></div>
      <div class="recipe-body">
        <h2>${r.title}</h2>
        <p class="meta">${r.time} • ${r.difficulty}</p>
        <h3>Ingredients</h3>
        <ul>${r.ingredients.map(i => <li>${i}</li>).join('')}</ul>
        <h3>Steps</h3>
        <ol>${r.steps.map(s => <li>${s}</li>).join('')}</ol>
        <p><button id="fav-btn" class="btn">${isFavorite(r.id) ? 'Remove Favorite' : 'Add to Favorites'}</button></p>
      </div>
    </div>
  `;
    initLazyLoading();
    document.getElementById('fav-btn')?.addEventListener('click', () => {
        if (isFavorite(r.id)) { removeFavorite(r.id); document.getElementById('fav-btn').textContent = 'Add to Favorites'; }
        else { saveFavorite(r.id); document.getElementById('fav-btn').textContent = 'Remove Favorite'; }
    });
}

function setupSearchAndFilter(recipes, container) {
    const input = document.getElementById('search');
    const filter = document.getElementById('tagFilter');
    if (!input || !filter) return;
    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        const filtered = recipes.filter(r => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q));
        renderRecipes(filtered, container);
    });
    filter.addEventListener('change', () => {
        const t = filter.value;
        const filtered = t === 'all' ? recipes : recipes.filter(r => r.tags.includes(t));
        renderRecipes(filtered, container);
    });
}

// handle submit recipe form (tips page)
function setupSubmitRecipeForm() {
    const form = document.getElementById('submitRecipe');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const r = {
            id: 'user-' + Date.now(),
            title: form.title.value.trim(),
            summary: form.summary.value.trim(),
            time: form.time.value.trim() || 'N/A',
            difficulty: form.difficulty.value,
            image: 'images/hero.jpg',
            ingredients: form.ingredients.value.split(',').map(s => s.trim()).filter(Boolean),
            steps: form.steps.value.split(';').map(s => s.trim()).filter(Boolean),
            tags: ['user-submitted']
        };
        const saved = JSON.parse(localStorage.getItem('userRecipes') || '[]');
        saved.unshift(r);
        localStorage.setItem('userRecipes', JSON.stringify(saved));
        alert('Recipe saved locally. It will appear on the Recipes page after reload.');
        form.reset();
    });
}

// initialization
document.addEventListener('DOMContentLoaded', async () => {
    const recipesList = await fetchRecipes();

    // homepage listing
    const listing = document.getElementById('listing');
    if (listing) renderRecipes(recipesList.slice(0, 6), listing);

    // recipes page list + search/filter
    const recipesContainer = document.getElementById('recipes-list');
    if (recipesContainer) {
        renderRecipes(recipesList, recipesContainer);
        setupSearchAndFilter(recipesList, recipesContainer);
    }

    // recipe detail if URL has a hash
    if (location.hash) {
        const id = location.hash.replace('#', '');
        renderRecipeDetail(id);
    } else {
        // if recipe-detail exists and no hash, render first recipe
        if (document.getElementById('recipe-detail') && recipesList.length) {
            renderRecipeDetail(recipesList[0].id);
        }
    }

    // submit recipe on tips page
    setupSubmitRecipeForm();
});
