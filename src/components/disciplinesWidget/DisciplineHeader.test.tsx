import { render } from '@testing-library/react';
import React from 'react';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from 'src/testSupport/resizeTo';
import { DisciplineHeader } from './DisciplineHeader';

describe('DisciplineHeader', () => {
  it('renders h3 on a mobile device', () => {
    resizeToMobile();

    const wrapper = render(<DisciplineHeader />);
    expect(wrapper.getByRole('heading', { level: 3 })).toBeVisible();
  });

  it('renders h2 on a tablet device', () => {
    resizeToTablet();

    const wrapper = render(<DisciplineHeader />);
    expect(wrapper.getByRole('heading', { level: 2 })).toBeVisible();
  });

  it('renders h1 on a desktop device', () => {
    resizeToDesktop();

    const wrapper = render(<DisciplineHeader />);
    expect(wrapper.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
