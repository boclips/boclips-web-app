import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { Header } from 'src/components/openstax/book/Header';
import { RenderResult } from '@testing-library/react';
import { OpenstaxMobileMenuProvider } from 'src/components/common/providers/OpenstaxMobileMenuProvider';

describe('OpenstaxBookHeader', () => {
  it('shows book title', () => {
    const wrapper = renderDefaultOpenstaxBookHeader();

    expect(
      wrapper.getByRole('heading', {
        level: 1,
        name: 'spies',
      }),
    ).toBeVisible();
  });

  it('does not show course content button on desktop', () => {
    window.resizeTo(1500, 1024);
    const wrapper = renderDefaultOpenstaxBookHeader();
    expect(courseContentButton(wrapper)).toBeNull();
  });

  describe('Mobile & Tablet view', () => {
    beforeEach(() => {
      window.resizeTo(768, 1024);
    });

    it('shows course content button', () => {
      const wrapper = renderDefaultOpenstaxBookHeader();
      expect(courseContentButton(wrapper)).toBeVisible();
    });
  });

  const courseContentButton = (wrapper: RenderResult) =>
    wrapper.queryByRole('button', {
      name: 'Course content',
    });

  const renderDefaultOpenstaxBookHeader = (): RenderResult =>
    renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Header bookTitle="spies" />
      </OpenstaxMobileMenuProvider>,
    );
});
