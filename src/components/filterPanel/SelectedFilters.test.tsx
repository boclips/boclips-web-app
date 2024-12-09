import { SelectedFilters } from '@components/filterPanel/SelectedFilters';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  FacetFactory,
  FacetsFactory,
} from 'boclips-api-client/dist/test-support/FacetsFactory';

describe('SelectedFilters', () => {
  it('display selected language filter from url', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?language=spa']}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <SelectedFilters
              removeFilter={vi.fn}
              facets={FacetsFactory.sample({
                languages: [
                  FacetFactory.sample({ id: 'spa', name: 'Spanish' }),
                ],
              })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Spanish')).toBeVisible();
  });

  it('display id if name of filter is not provided', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?language=spa&language=fra']}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <SelectedFilters
              removeFilter={vi.fn}
              facets={FacetsFactory.sample({
                languages: [
                  FacetFactory.sample({ id: 'spa', name: undefined }),
                  FacetFactory.sample({ id: 'fra', name: 'French' }),
                ],
              })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('spa')).toBeVisible();
    expect(await wrapper.findByText('French')).toBeVisible();
    expect(await wrapper.queryByText('fra')).not.toBeInTheDocument();
  });

  it('displays selected subtype display name', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?subtype=ANIMATION']}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <SelectedFilters
              removeFilter={jest.fn}
              facets={FacetsFactory.sample({
                videoSubtypes: [
                  FacetFactory.sample({ id: 'ANIMATION', name: 'Animation' }),
                ],
              })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Animation')).toBeVisible();
  });
});
