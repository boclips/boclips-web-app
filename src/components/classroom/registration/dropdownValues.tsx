import React from 'react';
import iso from 'iso-3166-1';
import ReactCountryFlag from 'react-country-flag';

const LIST_OF_COUNTRIES = iso.all().map((country) => ({
  id: country.alpha3,
  name: country.country,
  label: (
    <>
      <ReactCountryFlag countryCode={country.alpha2} /> {country.country}
    </>
  ),
  value: country.alpha3,
}));

export { LIST_OF_COUNTRIES };
