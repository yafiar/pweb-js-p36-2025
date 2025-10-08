const API_URL = "https://dummyjson.com/recipes";
const container = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");
const filterCuisine = document.getElementById("filterCuisine");
const showMoreBtn = document.getElementById("showMoreBtn");
const userGreeting = document.getElementById("userGreeting");
const logoutBtn = document.getElementById("logoutBtn");
const modal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".close");

let recipes = [];
let filteredRecipes = [];
let visibleCount = 6;
let debounceTimer;

const firstName = localStorage.getItem("firstName");
if (!firstName) {
  window.location.href = "index.html";
}
userGreeting.textContent = `Welcome, ${firstName}!`;

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("firstName");
  window.location.href = "index.html";
});

async function fetchRecipes() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch recipes.");
    const data = await res.json();
    recipes = data.recipes;
    filteredRecipes = recipes;
    renderCuisineFilter();
    renderRecipes();
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function renderCuisineFilter() {
  const cuisines = [...new Set(recipes.map(r => r.cuisine))];
  cuisines.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filterCuisine.appendChild(opt);
  });
}

function renderRecipes() {
  container.innerHTML = "";
  const toDisplay = filteredRecipes.slice(0, visibleCount);
  toDisplay.forEach(r => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${r.image}" alt="${r.name}">
      <div class="card-content">
        <h3>${r.name}</h3>
        <p><strong>Cook Time:</strong> ${r.cookTimeMinutes} min</p>
        <p><strong>Difficulty:</strong> ${r.difficulty}</p>
        <p><strong>Cuisine:</strong> ${r.cuisine}</p>
        <p class="rating">${"⭐".repeat(Math.round(r.rating))}</p>
        <p><strong>Ingredients:</strong> ${r.ingredients.slice(0, 3).join(", ")}...</p>
        <div style="margin-top: 0.8rem;">
          <button class="view-btn" onclick="viewRecipe(${r.id})">View Full Recipe</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  showMoreBtn.style.display = visibleCount < filteredRecipes.length ? "block" : "none";
}

showMoreBtn.addEventListener("click", () => {
  visibleCount += 6;
  renderRecipes();
});

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const q = searchInput.value.toLowerCase();
    filteredRecipes = recipes.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.ingredients.join(", ").toLowerCase().includes(q) ||
      r.tags.join(", ").toLowerCase().includes(q)
    );
    visibleCount = 6;
    renderRecipes();
  }, 500);
});

filterCuisine.addEventListener("change", () => {
  const val = filterCuisine.value;
  filteredRecipes = val ? recipes.filter(r => r.cuisine === val) : recipes;
  visibleCount = 6;
  renderRecipes();
});

function viewRecipe(id) {
  const recipe = recipes.find(r => r.id === id);
  modalBody.innerHTML = `
    <h2>${recipe.name}</h2>
    <img src="${recipe.image}" alt="${recipe.name}">
    <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
    <p><strong>Cook Time:</strong> ${recipe.cookTimeMinutes} minutes</p>
    <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
    <p><strong>Rating:</strong> ${"⭐".repeat(Math.round(recipe.rating))}</p>
    <hr style="margin:1rem 0;">
    <h3>Ingredients</h3>
    <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
    <h3>Instructions</h3>
    <p>${recipe.instructions.join(" ")}</p>
  `;
  modal.style.display = "block";
}

closeModal.onclick = () => (modal.style.display = "none");
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

fetchRecipes();
