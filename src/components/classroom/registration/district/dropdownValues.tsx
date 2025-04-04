import { BoclipsClient } from 'boclips-api-client';

export const getUsaStates = (client: BoclipsClient) => {
  const foundCountry = client.countries
    .allCountries()
    .find((country) => country.alpha3 === 'USA');

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
