import React from 'react';
import { render } from '@testing-library/react';
import LicensesArea from '@components/licensesArea/LicensesArea';

describe('Licenses', () => {
  it('displays licensed content card placeholder when still loading', () => {
    const wrapper = render(
      <LicensesArea licensedContentPage={null} onPageChange={null} isLoading />,
    );

    expect(
      wrapper.getAllByTestId('licensed-content-card-placeholder'),
    ).toHaveLength(6);
  });
});
