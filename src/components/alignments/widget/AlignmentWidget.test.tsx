import { render } from '@testing-library/react';
import React from 'react';
import { AlignmentWidget } from 'src/components/alignments/widget/AlignmentWidget';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';

describe('Alignment page header', () => {
  it('displays sparks page header and description', () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.alignments.setProviders([ProviderFactory.sample('openstax')]);

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <MemoryRouter initialEntries={['/sparks']}>
            <AlignmentWidget />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(wrapper.getByText('Spark')).toBeVisible();
    expect(
      wrapper.getByText('learning with our hand-picked video selections'),
    ).toBeVisible();

    expect(
      wrapper.getByText(
        'Discover video collections that are skillfully curated and educationally structured to enrich your course content',
      ),
    ).toBeVisible();
  });
});
