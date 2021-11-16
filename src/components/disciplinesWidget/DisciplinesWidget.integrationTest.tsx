import { fireEvent } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { analyticsMock } from 'src/services/analytics/AnalyticsServiceMock';
import SearchHero from './DisciplinesWidget';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';

describe('SearchHero', () => {
  AnalyticsFactory.getAppcues = jest.fn(() => analyticsMock);
  it('renders a search input and a button', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <SearchHero />
      </BoclipsClientProvider>,
    );

    expect(
      wrapper.getByRole('button', { name: /search/i }),
    ).toBeInTheDocument();

    expect(
      wrapper.getByRole('combobox', { name: /search/i }),
    ).toBeInTheDocument();
  });

  it('can take user input', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <SearchHero />
      </BoclipsClientProvider>,
    );

    const searchBar = wrapper.getByRole('combobox', {
      name: /search/i,
    }) as HTMLInputElement;

    fireEvent.change(searchBar, { target: { value: 'help' } });
    expect(searchBar.value).toEqual('help');
  });

  it('sends a search event on search', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <SearchHero />
      </BoclipsClientProvider>,
    );

    const searchBar = wrapper.getByRole('combobox', {
      name: /search/i,
    }) as HTMLInputElement;

    fireEvent.change(searchBar, { target: { value: 'help' } });
    fireEvent.click(wrapper.getByRole('button', { name: /search/i }));

    expect(analyticsMock.sendEvent).toHaveBeenCalledWith('HOMEPAGE_SEARCH', {
      query: 'help',
    });
  });
});
