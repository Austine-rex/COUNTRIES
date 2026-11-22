document.addEventListener('DOMContentLoaded', () => {
  const countries = document.querySelector('.country-info');
  const searchInput = document.querySelector('#searchInput');
  const regionFilter = document.querySelector('#regionFilter');
  const darkToggle = document.querySelector('.icon');
  const themeLabel = document.querySelector('.dark');
  const detailsView = document.querySelector('.country-details');
  const backBtn = document.querySelector('.back-btn');
  const detailsContainer = document.querySelector('.details-container');

  let displayedCountries = [];

  // FETCH DATA
  async function getAPI() {
    try {
      const res = await fetch('./data.json');
      const data = await res.json();
      displayedCountries = data;
      allCountries(displayedCountries);
    } catch (err) {
      console.log(err);
    }
  }
  getAPI();

  // RENDER COUNTRIES
  function allCountries(list) {
    detailsView.classList.add('hidden');
    countries.classList.remove('hidden');

    if (!list.length) {
      countries.innerHTML = `
        <p class="empty-state">No countries found. Try a different search or region.</p>
      `;
      return;
    }

    countries.innerHTML = list.map(country => `
      <article class="countries" data-name="${country.name}" tabindex="0">
        <figure id="country-img">
          <img src="${country.flags.svg}" alt="Flag of ${country.name}" loading="lazy">
        </figure>
        <div class="info">
          <h3>${country.name}</h3>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Capital:</strong> ${country.capital || '—'}</p>
        </div>
      </article>
    `).join('');
  }

  // SEARCH
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    const filtered = displayedCountries.filter(country =>
      country.name.toLowerCase().includes(value)
    );
    allCountries(filtered);
  });

  // REGION FILTER
  regionFilter.addEventListener('change', () => {
    const region = regionFilter.value;

    if (region === 'all') {
      allCountries(displayedCountries);
      return;
    }

    const filtered = displayedCountries.filter(
      country => country.region === region
    );
    allCountries(filtered);
  });

  // CLICK COUNTRY → DETAILS
  countries.addEventListener('click', (e) => {
    const card = e.target.closest('.countries');
    if (!card) return;

    const countryName = card.dataset.name;
    const country = displayedCountries.find(
      c => c.name === countryName
    );

    showCountryDetails(country);
  });

  // SHOW DETAILS
  function showCountryDetails(country) {
    countries.classList.add('hidden');
    detailsView.classList.remove('hidden');

    const borders = country.borders
      ? country.borders.map(code => {
          const border = displayedCountries.find(c => c.alpha3Code === code);
          return border ? `<button class="border-btn">${border.name}</button>` : '';
        }).join('')
      : 'None';

    detailsContainer.innerHTML = `
      <div class="details">
        <figure class="details-flag">
          <img src="${country.flags.svg}" alt="Flag of ${country.name}">
        </figure>
        <div class="details-text">
          <h2>${country.name}</h2>
          <div class="details-meta">
            <div class="details-col">
              <p><strong>Native Name:</strong> ${country.nativeName}</p>
              <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
              <p><strong>Region:</strong> ${country.region}</p>
              <p><strong>Sub Region:</strong> ${country.subregion}</p>
              <p><strong>Capital:</strong> ${country.capital || '—'}</p>
            </div>
            <div class="details-col">
              <p><strong>Top Level Domain:</strong> ${country.topLevelDomain.join(', ')}</p>
              <p><strong>Currencies:</strong> ${country.currencies.map(c => c.name).join(', ')}</p>
              <p><strong>Languages:</strong> ${country.languages.map(l => l.name).join(', ')}</p>
            </div>
          </div>
          <div class="borders">
            <strong>Border Countries:</strong>
            <div class="border-list">${borders}</div>
          </div>
        </div>
      </div>
    `;
  }

  // BACK BUTTON
  backBtn.addEventListener('click', () => {
    detailsView.classList.add('hidden');
    countries.classList.remove('hidden');
  });

  // DARK MODE
  darkToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    darkToggle.setAttribute('aria-pressed', String(isDark));
    themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkToggle.setAttribute('aria-pressed', 'true');
    themeLabel.textContent = 'Light Mode';
  }
});
