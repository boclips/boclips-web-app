import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoogleClassroomUrlBuilder } from './GoogleClassroomUrlBuilder';
import { GoogleClassroomShareLink } from './GoogleClassroomShareLink';

describe('GoogleClassroomShareLink', () => {
  it('has href with correct url', async () => {
    const wrapper = render(
      <GoogleClassroomShareLink
        link="https://example.com"
        postTitle="Title"
        postBody="Body"
        onClick={jest.fn}
      />,
    );

    const classroomLink = await wrapper.findByTestId('classroom-link');

    expect(classroomLink).toBeVisible();
    expect(classroomLink).toHaveProperty(
      'href',
      new GoogleClassroomUrlBuilder()
        .setVideoUrl('https://example.com')
        .setTitle('Title')
        .setBody('Body')
        .build(),
    );
    expect(classroomLink).toHaveProperty('target', '_blank');
  });

  it('calls onClick when clicked on', async () => {
    const onClickSpy = jest.fn();
    const wrapper = render(
      <GoogleClassroomShareLink
        link="https://example.com"
        postTitle="Title"
        postBody="Body"
        onClick={onClickSpy}
      />,
    );

    await userEvent.click(await wrapper.findByTestId('classroom-link'));

    expect(onClickSpy).toHaveBeenCalled();
  });
});
