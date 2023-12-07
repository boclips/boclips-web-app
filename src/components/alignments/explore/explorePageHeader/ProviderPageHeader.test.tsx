import React from 'react';
import ProviderPageHeader from 'src/components/alignments/explore/explorePageHeader/ProviderPageHeader';
import { fireEvent, render } from '@testing-library/react';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';
import * as router from 'react-router';

describe('Provider Page page Header', () => {
  const navigate = jest.fn();

  beforeAll(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
  });

  it('displays header text and an OpenStax ally logo', () => {
    const header = render(
      <AlignmentContextProvider provider={ProviderFactory.sample('openstax')}>
        <ProviderPageHeader />
      </AlignmentContextProvider>,
    );

    expect(header.getByText('Our OpenStax collection')).toBeVisible();
    expect(
      header.getByText(
        'Explore our video library, expertly curated for your ebook',
      ),
    ).toBeVisible();
    expect(header.getByAltText('OpenStax logo')).toBeVisible();
  });

  it('shows a Back button which redirects to Alignments page', () => {
    const header = render(
      <AlignmentContextProvider provider={ProviderFactory.sample('openstax')}>
        <ProviderPageHeader />
      </AlignmentContextProvider>,
    );

    fireEvent.click(header.getByRole('button', { name: 'Back' }));
    expect(navigate).toHaveBeenCalledWith('/alignments');
  });
});
