import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import createMarkupForOneCountry from './templates/markup_country.hbs';
import createMarkupForSomeCountries from './templates/markup_countries.hbs';

const DEBOUNCE_DELAY = 300;
const options = { timeout: 1000 };

const inputEl = document.querySelector('#search-box');
const divForInfoEl = document.querySelector('.country-info');
const ulForInfoEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const valueInput = event.target.value.trim();

  if (!valueInput) {
    clearMarkup();
    return;
  }

  fetchCountries(valueInput)
    .then(countries => {
      clearMarkup();

      if (countries.length > 10) {
        createAlertInfo(
          'Too many matches found. Please enter a more specific name.'
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
      createAlertFail(error);
    });
}

function clearMarkup() {
  divForInfoEl.innerHTML = '';
  ulForInfoEl.innerHTML = '';
}

function createAlertInfo(message) {
  Notiflix.Notify.info(message, options);
}

function createAlertFail(message) {
  Notiflix.Notify.failure(message, options);
}
