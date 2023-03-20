import React from 'react';
import { render } from '@testing-library/react';
import SparksCard from 'src/components/sparks/menu/SparksCard';
import { getProviderByName } from 'src/views/alignments/provider/AlignmentProviderFactory';
import { MemoryRouter } from 'react-router-dom';

describe('Sparks card', () => {
  it('displays the provider name', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <SparksCard provider={getProviderByName('openstax')} />,
      </MemoryRouter>,
    );

    expect(wrapper.getByText('OpenStax')).toBeVisible();
  });

  it('displays the provider description', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <SparksCard provider={getProviderByName('openstax')} />,
      </MemoryRouter>,
    );

    expect(
      wrapper.getByText(
        'Explore our video library, expertly curated for your ebook',
      ),
    );
  });

  it('displays the provider logo', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <SparksCard provider={getProviderByName('openstax')} />,
      </MemoryRouter>,
    );

    expect(wrapper.getByAltText(`OpenStax logo`)).toBeVisible();
  });
});
