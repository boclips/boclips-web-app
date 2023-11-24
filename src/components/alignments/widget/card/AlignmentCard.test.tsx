import React from 'react';
import { render } from '@testing-library/react';
import AlignmentCard from 'src/components/alignments/widget/card/AlignmentCard';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';
import { MemoryRouter } from 'react-router-dom';

describe('Alignment card', () => {
  it('displays the provider name', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <AlignmentCard provider={ProviderFactory.sample('openstax')} />,
      </MemoryRouter>,
    );

    expect(wrapper.getByText('OpenStax')).toBeVisible();
  });

  it('displays the provider description', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <AlignmentCard provider={ProviderFactory.sample('openstax')} />,
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
        <AlignmentCard provider={ProviderFactory.sample('openstax')} />,
      </MemoryRouter>,
    );

    expect(wrapper.getByAltText(`OpenStax logo`)).toBeVisible();
  });
});
