import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { OpenstaxBookHeader } from 'src/components/openstax/book/OpenstaxBookHeader';
import { fireEvent, RenderResult } from '@testing-library/react';

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

    it('calls callback when course content button is clicked', () => {
      const spy = jest.fn();
      const wrapper = renderWithClients(
        <OpenstaxBookHeader bookTitle="spies" openCourseContent={spy} />,
      );

      fireEvent.click(courseContentButton(wrapper));
      expect(spy).toHaveBeenCalled();
    });
  });

  const courseContentButton = (wrapper: RenderResult) =>
    wrapper.queryByRole('button', {
      name: 'Course content',
    });

  const renderDefaultOpenstaxBookHeader = (): RenderResult =>
    renderWithClients(
      <OpenstaxBookHeader bookTitle="spies" openCourseContent={jest.fn} />,
    );
});
