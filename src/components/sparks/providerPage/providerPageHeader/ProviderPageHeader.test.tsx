import React from 'react';
import ProviderPageHeader from 'src/components/sparks/providerPage/providerPageHeader/ProviderPageHeader';
import { render } from '@testing-library/react';
import { getProviderByName } from 'src/views/alignments/provider/AlignmentProviderFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';

describe('Provider Page page Header', () => {
  it('displays header text and an OpenStax ally logo', () => {
    const header = render(
      <AlignmentContextProvider provider={getProviderByName('openstax')}>
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
});
