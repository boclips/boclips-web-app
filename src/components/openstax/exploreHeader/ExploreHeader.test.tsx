import React from 'react';
import ExploreHeader from 'src/components/openstax/exploreHeader/ExploreHeader';
import { render } from '@testing-library/react';

describe('OpenStax Explore page Header', () => {
  it('displays header text and an OpenStax ally logo', () => {
    const header = render(<ExploreHeader />);

    expect(header.getByText('Our OpenStax collection')).toBeVisible();
    expect(
      header.getByText(
        'Explore our video library, expertly curated for your ebook',
      ),
    ).toBeVisible();
    expect(header.getByAltText("We're an OpenStax ally")).toBeVisible();
  });
});
