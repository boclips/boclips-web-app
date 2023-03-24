import React from 'react';
import { render } from '@testing-library/react';
import SparksCard from 'src/components/sparks/widget/card/SparksCard';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';
import { MemoryRouter } from 'react-router-dom';

describe('Sparks card', () => {
  it('displays the provider name', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <SparksCard provider={ProviderFactory.sample('openstax')} />,
      </MemoryRouter>,
    );

    expect(wrapper.getByText('OpenStax')).toBeVisible();
  });

  it('displays the provider description', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <SparksCard provider={ProviderFactory.sample('openstax')} />,
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
        <SparksCard provider={ProviderFactory.sample('openstax')} />,
      </MemoryRouter>,
    );

    expect(wrapper.getByAltText(`OpenStax logo`)).toBeVisible();
  });
});
