import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import createMarkupForOneCountry from './templates/markup.hbs';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const divForInfoEl = document.querySelector('.country-info');
const inputEl = document.querySelector('#search-box');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  if (!event.target.value) {
    divForInfoEl.innerHTML = '';
    return;
  }
  fetchCountries(event.target.value)
    .then(countries => {
      if (countries.length > 10) {
        alert('"Too many matches found. Please enter a more specific name."');
        return '';
      }
      if (countries.length <= 10 && countries.length >= 2) {
        return countries.map(createMarkupForSomeCountries).join('');
      }

      return createMarkupForOneCountry(countries[0]);
    })
    .then(markup => (divForInfoEl.innerHTML = markup))
    .catch(error => Notiflix.Notify.failure(error));
}

function createMarkupForSomeCountries({ flags, name }) {
  return `<p><img src = "${flags.svg}" alt = "Flag of ${name.common}" width='80'> 
  <span>${name.official}</span><p>`;
}
