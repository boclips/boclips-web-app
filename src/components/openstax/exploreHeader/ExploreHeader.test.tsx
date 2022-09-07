import React from 'react';
import ExploreHeader from 'src/components/openstax/exploreHeader/ExploreHeader';
import { render } from '@testing-library/react';

describe('OpenStax Explore page Header', () => {
  it('displays an OpenStax ally logo', () => {
    const header = render(<ExploreHeader />);

    expect(header.getByAltText("We're an OpenStax ally")).toBeVisible();
  });
});
