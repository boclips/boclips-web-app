const createDropdownOptions = (items) =>
  items.map((item) => {
    const id = item.replace(' ', '-').toLowerCase();
    return { id, name: item, label: item, value: item };
  });

const USAGE_FREQUENCY = createDropdownOptions([
  'Very rarely',
  'A few times a month',
  'A few times a week',
  'A few times a day',
]);

const INSTRUCTIONAL_VIDEO_SOURCE = createDropdownOptions([
  'District Provided Resource',
  'YouTube',
  'Other free video sites',
  'N/A',
]);

const VIDEO_RESOURCE_BARRIERS = createDropdownOptions([
  'Time required to locate relevant videos',
  'Lack of alignment to core curriculum',
  'Misinformation/disinformation',
  'Ads and other related privacy concerns',
]);

const SUBJECTS = createDropdownOptions([
  'ELA',
  'Math',
  'Social Studies',
  'Science',
  'P.E.',
  'Fine Arts',
  'SPED',
  'N/A',
]);

const REASON = createDropdownOptions([
  'It takes me too long to find relevant videos',
  'It’s hard to find standards aligned videos',
  'I’m concerned about misinformation in free online videos',
  'I’m concerned about Ads and other content appropriateness concerns',
]);

export {
  USAGE_FREQUENCY,
  INSTRUCTIONAL_VIDEO_SOURCE,
  VIDEO_RESOURCE_BARRIERS,
  SUBJECTS,
  REASON,
};
