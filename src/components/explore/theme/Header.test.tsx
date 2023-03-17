import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { Header } from 'src/components/explore/theme/Header';
import { RenderResult } from '@testing-library/react';
import { ThemeMobileMenuProvider } from 'src/components/common/providers/ThemeMobileMenuProvider';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';
import { getProviderByName } from 'src/views/openstax/provider/AlignmentProviderFactory';

describe('Theme Header', () => {
  it('shows theme and topic title', () => {
    const wrapper = renderDefaultThemeHeader();

    expect(
      wrapper.getByRole('heading', { level: 1, name: 'spies' }),
    ).toBeVisible();

    expect(
      wrapper.getByRole('heading', { level: 2, name: 'Chapter 1: Title' }),
    ).toBeVisible();
  });

  it('does not show course content button on desktop', () => {
    window.resizeTo(1500, 1024);
    const wrapper = renderDefaultThemeHeader();
    expect(courseContentButton(wrapper)).toBeNull();
  });

  describe('Mobile & Tablet view', () => {
    beforeEach(() => {
      window.resizeTo(768, 1024);
    });

    it('shows course content button', () => {
      const wrapper = renderDefaultThemeHeader();
      expect(courseContentButton(wrapper)).toBeVisible();
    });
  });

  const courseContentButton = (wrapper: RenderResult) =>
    wrapper.queryByRole('button', {
      name: 'Course content',
    });

  const renderDefaultThemeHeader = (): RenderResult =>
    renderWithClients(
      <ThemeMobileMenuProvider>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <Header themeTitle="spies" topicTitle="Chapter 1: Title" />
        </AlignmentContextProvider>
      </ThemeMobileMenuProvider>,
    );
});
