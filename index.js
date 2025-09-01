const container = document.getElementById('personajes-container');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('search');

let allCharacters = [];

async function fetchPersonajes() {
  container.setAttribute('aria-busy', 'true');
  loader.style.display = 'block';
  errorMessage.style.display = 'none';

  try {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (Array.isArray(data.results)) {
      allCharacters = data.results;
      renderPersonajes(allCharacters);
    } else {
      throw new Error('La respuesta no contiene resultados válidos.');
    }
  } catch (error) {
    errorMessage.textContent = `Error al obtener personajes: ${error.message}`;
    errorMessage.style.display = 'block';
  } finally {
    loader.style.display = 'none';
    container.setAttribute('aria-busy', 'false');
  }
}

function renderPersonajes(personajes) {
  container.innerHTML = '';

  if (personajes.length === 0) {
    container.innerHTML = `<p style="text-align:center;">No se encontraron personajes.</p>`;
    return;
  }

  personajes.forEach((personaje, index) => {
    const article = document.createElement('article');
    article.setAttribute('tabindex', '0');
    article.style.animationDelay = `${index * 0.05}s`;

    article.innerHTML = `
      <div class="image-container">
        <img src="${personaje.image}" alt="Imagen de ${personaje.name}" />
      </div>
      <h2>${personaje.name}</h2>
      <span>Estado: ${personaje.status}</span>
    `;

    container.appendChild(article);
  });
}

// Filtro por nombre (buscador)
searchInput.addEventListener('input', e => {
  const search = e.target.value.toLowerCase().trim();
  const filtrados = allCharacters.filter(char =>
    char.name.toLowerCase().includes(search)
  );
  renderPersonajes(filtrados);
});

fetchPersonajes();
