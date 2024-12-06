import React from 'react';
import { render } from '@src/testSupport/render';
import UnauthorizedNavbar from '@components/layout/UnauthorizedNavbar';

describe(`Unauthorized Navbar`, () => {
  it('renders the Classroom logo', async () => {
    const wrapper = render(<UnauthorizedNavbar />);

    expect(await wrapper.findByTestId('classroom-logo')).toBeVisible();
  });
});
