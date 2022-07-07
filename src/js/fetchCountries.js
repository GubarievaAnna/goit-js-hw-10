const URL_LINK = 'https://restcountries.com/v3.1/name';

export const fetchCountries = name => {
  return fetch(
    `${URL_LINK}/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw 'Oops, there is no country with that name';
    }
    return response.json();
  });
};
