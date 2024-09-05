import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { BoclipsClient } from 'boclips-api-client';

export const countries = (client: BoclipsClient) =>
  client.countries.allCountries().map((country) => ({
    id: country.alpha3,
    name: country.name,
    label: (
      <>
        <ReactCountryFlag countryCode={country.alpha2} /> {country.name}
      </>
    ),
    value: country.alpha3,
  }));

export const states = (selectedCountry: string, client: BoclipsClient) => {
  const foundCountry = client.countries
    .allCountries()
    .find((country) => country.alpha3 === selectedCountry);

  if (foundCountry && foundCountry.states.length > 0) {
    return foundCountry.states.map((state) => ({
      id: state.id,
      name: state.name,
      label: state.name,
      value: state.id,
    }));
  }

  return null;
};
