import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from '@src/App';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';
import { ProviderFactory } from '@src/views/alignments/provider/ProviderFactory';
import {
  createTheme,
  setUpClientWithTheme,
} from '@src/views/alignments/theme/ThemeTestSupport';

describe(`Explore view`, () => {
  it('renders loading skeletons before data is loaded', async () => {
    const theme = createTheme();

    const fakeClient = setUpClientWithTheme(theme);
    const wrapper = render(
      <MemoryRouter initialEntries={['/alignments/openstax']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByTestId('Loading details for provider'));

    const loadingSkeleton = await wrapper.findByTestId(
      'Loading details for provider',
    );

    expect(loadingSkeleton).not.toBeNull();
    expect(await wrapper.findByText('Our OpenStax collection')).toBeVisible();
    expect(loadingSkeleton).not.toBeInTheDocument();
  });

  it(`shows 'All' types as a first one and can select other types`, async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.alignments.setProviders([
      ProviderFactory.sample('openstax', {
        types: ['Maths', 'French', 'Physics'],
      }),
    ]);
    fakeClient.alignments.setThemesByProvider({
      providerName: 'openstax',
      themes: [
        ThemeFactory.sample({
          id: 'theme-1',
          title: 'Maths book',
          type: 'Maths',
        }),
        ThemeFactory.sample({
          id: 'theme-2',
          title: 'French book',
          type: 'French',
        }),
        ThemeFactory.sample({
          id: 'theme-3',
          title: 'Physics-1',
          type: 'Physics',
        }),
        ThemeFactory.sample({
          id: 'theme-4',
          title: 'Physics-2',
          type: 'Physics',
        }),
      ],
    });

    const wrapper = render(
      <MemoryRouter initialEntries={['/alignments/openstax']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Maths book')).toBeVisible();
    expect(await wrapper.findByText('French book')).toBeVisible();
    expect(await wrapper.findByText('Physics-1')).toBeVisible();
    expect(await wrapper.findByText('Physics-2')).toBeVisible();

    await userEvent.click(wrapper.getByLabelText('type Maths'));

    expect(await wrapper.findByText('Maths book')).toBeVisible();
    expect(wrapper.queryByText('French book')).toBeNull();
    expect(wrapper.queryByText('Physics-1')).toBeNull();
    expect(wrapper.queryByText('Physics-2')).toBeNull();

    await userEvent.click(wrapper.getByLabelText('type French'));

    expect(wrapper.queryByText('Maths book')).toBeNull();
    expect(await wrapper.findByText('French book')).toBeVisible();
    expect(wrapper.queryByText('Physics-1')).toBeNull();
    expect(wrapper.queryByText('Physics-2')).toBeNull();
  });

  it('shows Page not found when used non existing provider', async () => {
    const fakeClient = new FakeBoclipsClient();
    const wrapper = render(
      <MemoryRouter initialEntries={['/alignments/wrong-provider']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );
    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it(`only show types that are supported`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.alignments.setThemesByProvider({
      providerName: 'openstax',
      themes: [
        ThemeFactory.sample({
          id: 'theme-1',
          type: 'Maths',
        }),
        ThemeFactory.sample({
          id: 'theme-2',
          type: 'French',
        }),
      ],
    });

    fakeClient.alignments.setProviders([
      ProviderFactory.sample('openstax', {
        types: ['Maths', 'Business', 'Humanities'],
      }),
    ]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/alignments/openstax']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Our OpenStax collection')).toBeVisible();

    await waitFor(() =>
      expect(wrapper.getByLabelText('type Maths')).toBeVisible(),
    );

    expect(wrapper.getByLabelText('type All')).toBeVisible();
    expect(wrapper.getByLabelText('type Business')).toBeVisible();
    expect(wrapper.getByLabelText('type Humanities')).toBeVisible();
    expect(wrapper.queryByLabelText('type French')).toBeNull();
  });

  describe('Type menu focus', () => {
    it('changes the focus when type is selected', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.alignments.setThemesByProvider({
        providerName: 'openstax',
        themes: [
          ThemeFactory.sample({
            id: 'theme-1',
            type: 'Maths',
            title: 'Algebra',
          }),
          ThemeFactory.sample({
            id: 'theme-2',
            type: 'French',
          }),
        ],
      });

      fakeClient.alignments.setProviders([
        ProviderFactory.sample('openstax', {
          types: ['Maths', 'Business', 'Humanities'],
        }),
      ]);

      const wrapper = render(
        <MemoryRouter initialEntries={['/alignments/openstax']}>
          <App
            apiClient={fakeClient}
            boclipsSecurity={stubBoclipsSecurity}
            reactQueryClient={new QueryClient()}
          />
        </MemoryRouter>,
      );

      await waitFor(() => wrapper.getAllByText('Maths'));

      await userEvent.click(wrapper.getByText('All'));

      await userEvent.tab();

      await userEvent.keyboard('{enter}');

      await waitFor(() => wrapper.getAllByText('Algebra'));

      await waitFor(() => {
        expect(wrapper.getByLabelText('theme Algebra')).toHaveFocus();
      });
    });
  });
});
