import React from 'react';
import iso from 'iso-3166-1';
import ReactCountryFlag from 'react-country-flag';

const createDropdownOptions = (items) =>
  items.map((item) => {
    const id = item.replace(' ', '-').toLowerCase();
    return { id, name: item, value: item };
  });

const TYPE_OF_ORG = createDropdownOptions([
  'EdTech',
  'School / College / University',
  'Ministry of Education',
  'Online Learning Provider',
  'Curriculum Designer',
  'Other',
]);

const AUDIENCE = createDropdownOptions([
  'K12',
  'Higher Ed',
  'Workforce',
  'Other',
]);

const JOB_TITLE = createDropdownOptions([
  'Curriculum Developer/Instructional Designer',
  'Product Manager/Owner',
  'Procurement/Licensing/Purchasing',
  'Administrator',
  'Portfolio Manager',
  'Project Manager',
  'Faculty',
  'Technology Specialist',
  'Executive',
  'Teacher',
  'Professor',
  'Other',
]);

const DISCOVERY_METHOD = createDropdownOptions([
  'Search Engine (Google, Bing etc)',
  'Industry newsletter',
  'Blog or Publication',
  'Employer',
  'Recommended by Friend or Colleague',
  'Contacted by Boclips',
  'School ad board/website',
  'Social Media',
  'Other',
]);

const ORGANIZATION_TYPE = createDropdownOptions([
  'Publisher',
  'Edtech',
  'Virtual/Charter Schools',
  'Government',
  'College/University',
  'Other',
]);

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

export {
  TYPE_OF_ORG,
  AUDIENCE,
  JOB_TITLE,
  LIST_OF_COUNTRIES,
  DISCOVERY_METHOD,
  ORGANIZATION_TYPE,
};
