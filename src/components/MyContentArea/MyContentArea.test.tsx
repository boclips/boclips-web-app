import React from 'react';
import { render } from '@testing-library/react';
import MyContentArea from 'src/components/MyContentArea/MyContentArea';

describe('My Content Area', () => {
  it('displays licensed content card placeholder when still loading', () => {
    const wrapper = render(
      <MyContentArea
        licensedContentPage={null}
        onPageChange={null}
        isLoading
      />,
    );

    expect(
      wrapper.getAllByTestId('licensed-content-card-placeholder'),
    ).toHaveLength(6);
  });
});
