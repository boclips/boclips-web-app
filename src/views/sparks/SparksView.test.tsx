import { render } from '@testing-library/react';
import React from 'react';
import { SparksView } from 'src/views/sparks/SparksView';

describe('SparksView', () => {
  it('displays sparks page header and description', () => {
    const wrapper = render(<SparksView />);

    expect(
      wrapper.getByText('Spark learning with our video picks'),
    ).toBeVisible();

    expect(
      wrapper.getByText(
        'Discover our video collections: Pedagogically-sequenced and expertly-curated for your course',
      ),
    ).toBeVisible();
  });
});
