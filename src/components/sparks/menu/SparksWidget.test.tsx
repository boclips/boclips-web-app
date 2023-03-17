import { render } from '@testing-library/react';
import React from 'react';
import { SparksWidget } from 'src/components/sparks/menu/SparksWidget';
import { MemoryRouter } from 'react-router-dom';

describe('Sparks page header', () => {
  it('displays sparks page header and description', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <SparksWidget />
      </MemoryRouter>,
    );

    expect(wrapper.getByText('Spark')).toBeVisible();
    expect(wrapper.getByText('learning with our video picks')).toBeVisible();

    expect(
      wrapper.getByText(
        'Discover our video collections: Pedagogically-sequenced and expertly-curated for your course',
      ),
    ).toBeVisible();
  });
});
