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
