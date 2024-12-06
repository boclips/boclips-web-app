import { render } from '@testing-library/react';
import React from 'react';
import InvisibleNavbar from '@components/common/invisibleNavbar/InvisibleNavbar';

describe('invisible navbar', () => {
  it('displays the library logo by default', () => {
    const wrapper = render(<InvisibleNavbar />);

    expect(wrapper.getByTestId('library-logo')).toBeInTheDocument();
  });

  it('displays the library logo when specified', () => {
    const wrapper = render(<InvisibleNavbar product="LIBRARY" />);

    expect(wrapper.getByTestId('library-logo')).toBeInTheDocument();
  });

  it('displays the classroom logo when specified', () => {
    const wrapper = render(<InvisibleNavbar product="CLASSROOM" />);

    expect(wrapper.getByTestId('classroom-logo')).toBeInTheDocument();
  });

  it('displays the skip for screenreaders', () => {
    const wrapper = render(<InvisibleNavbar />);

    expect(wrapper.getByTestId('skip_to_content')).toBeInTheDocument();
  });
});
