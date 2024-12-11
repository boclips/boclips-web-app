import React from 'react';
import ProviderPageHeader from '@components/alignments/explore/explorePageHeader/ProviderPageHeader';
import { render } from '@testing-library/react';
import { ProviderFactory } from '@src/views/alignments/provider/ProviderFactory';
import { AlignmentContextProvider } from '@components/common/providers/AlignmentContextProvider';
import * as router from 'react-router';
import userEvent from "@testing-library/user-event";

describe('Provider Page page Header', () => {
  const navigate = vi.fn();

  beforeAll(() => {
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
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

  it('shows a Back button which redirects to Alignments page', async () => {
    const header = render(
      <AlignmentContextProvider provider={ProviderFactory.sample('openstax')}>
        <ProviderPageHeader />
      </AlignmentContextProvider>,
    );

    await userEvent.click(header.getByRole('button', { name: 'Back' }));
    expect(navigate).toHaveBeenCalledWith('/alignments');
  });
});
