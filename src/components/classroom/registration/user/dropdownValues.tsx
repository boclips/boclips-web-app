import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { BoclipsClient } from 'boclips-api-client';

export interface Country {
  name: string;
  label: React.JSX.Element;
  code: string;
}

export const getCountries = (client: BoclipsClient): Country[] =>
  client.countries.allCountries().map((country) => ({
    name: country.name,
    label: (
      <>
        <ReactCountryFlag
          countryCode={country.alpha2}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '0.25rem',
          }}
        />{' '}
        {country.name}
      </>
    ),
    code: country.alpha3,
  }));

export const getCountry = (selectedCountry: string, client: BoclipsClient) =>
  client.countries
    .allCountries()
    .find((country) => country.alpha3 === selectedCountry);
export const getCountryStates = (
  selectedCountry: string,
  client: BoclipsClient,
) => {
  const foundCountry = getCountry(selectedCountry, client);

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

export const usaSchools = async (
  selectedState: string,
  query: string,
  client: BoclipsClient,
) => {
  return client.schools
    .searchUsaSchools(selectedState, query)
    .then((foundSchools) => {
      foundSchools.map((school) => ({
        id: school.externalId,
        name: school.name,
        label: school.name,
        value: school.externalId,
      }));
    });
};
