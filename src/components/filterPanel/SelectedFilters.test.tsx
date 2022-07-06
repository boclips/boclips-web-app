import { SelectedFilters } from 'src/components/filterPanel/SelectedFilters';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from 'react-query';
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
              removeFilter={jest.fn}
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
});
