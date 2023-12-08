import InvisibleNavbar from 'src/components/registration/invisibleNavbar/InvisibleNavbar';
import { render } from '@testing-library/react';
import React from 'react';

describe('invisible navbar', () => {
  it('displays the logo', () => {
    const wrapper = render(<InvisibleNavbar />);

    expect(wrapper.getByTestId('logo')).toBeInTheDocument();
  });
  it('displays the skip for screenreaders', () => {
    const wrapper = render(<InvisibleNavbar />);

    expect(wrapper.getByTestId('skip_to_content')).toBeInTheDocument();
  });
});