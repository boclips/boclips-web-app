import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { AlignmentWidget } from '@src/components/alignments/widget/AlignmentWidget';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from '@src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProviderFactory } from '@src/views/alignments/provider/ProviderFactory';

describe('Alignment page header', () => {
  it('displays alignments page header and description', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.alignments.setProviders([ProviderFactory.sample('openstax')]);

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <MemoryRouter initialEntries={['/alignments']}>
            <AlignmentWidget />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );
    waitFor(() => {
      expect(wrapper.getByTestId('alignments-header-title')).toHaveTextContent(
        'Inspire learning with our expertly aligned videos',
      );
    });
    expect(
      await wrapper.findByText(
        'Fulfill essential educational standards and curriculum objectives with our curated Alignments. Video selection is tailored to state standards and curriculum criteria, providing content that aligns with and underpins your educational requirements.',
      ),
    ).toBeVisible();
  });
});
