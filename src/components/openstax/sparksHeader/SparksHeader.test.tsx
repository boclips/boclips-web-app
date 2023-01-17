import React from 'react';
import SparksHeader from 'src/components/openstax/sparksHeader/SparksHeader';
import { render } from '@testing-library/react';

describe('OpenStax Sparks page Header', () => {
  it('displays header text and an OpenStax ally logo', () => {
    const header = render(<SparksHeader />);

    expect(header.getByText('Our OpenStax collection')).toBeVisible();
    expect(
      header.getByText(
        'Explore our video library, expertly curated for your ebook',
      ),
    ).toBeVisible();
    expect(header.getByAltText("We're an OpenStax ally")).toBeVisible();
  });
});
