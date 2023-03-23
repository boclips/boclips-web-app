import { render } from '@testing-library/react';
import React from 'react';
import { SparksWidget } from 'src/components/sparks/widget/SparksWidget';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTestProviderByName } from 'src/views/alignments/provider/AlignmentProviderFactory';

describe('Sparks page header', () => {
  it('displays sparks page header and description', () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.alignments.setProviders([getTestProviderByName('openstax')]);

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <MemoryRouter initialEntries={['/sparks']}>
            <SparksWidget />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
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
