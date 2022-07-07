import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import createMarkupForOneCountry from './templates/markup_country.hbs';
import createMarkupForSomeCountries from './templates/markup_countries.hbs';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const divForInfoEl = document.querySelector('.country-info');
const ulForInfoEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  if (!event.target.value) {
    clearMarkup();
    return;
  }

  fetchCountries(event.target.value)
    .then(countries => {
      clearMarkup();

      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.',
          { timeout: 800 }
        );
        return;
      }

      if (countries.length <= 10 && countries.length >= 2) {
        ulForInfoEl.innerHTML = countries
          .map(createMarkupForSomeCountries)
          .join('');
        return;
      }

      divForInfoEl.innerHTML = createMarkupForOneCountry(countries[0]);
      return;
    })
    .catch(error => {
      clearMarkup();
      Notiflix.Notify.failure(error, { timeout: 800 });
    });
}

function clearMarkup() {
  divForInfoEl.innerHTML = '';
  ulForInfoEl.innerHTML = '';
}
