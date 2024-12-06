import { render } from '@testing-library/react';
import React from 'react';
import { EditingRestrictionsLabel } from '@components/videoPage/videoLicensingDetails/EditingRestrictionsLabel';

describe('Editing restrictions label', () => {
  it('displays ALLOWED editing restriction', async () => {
    const wrapper = render(<EditingRestrictionsLabel permission="ALLOWED" />);

    expect(wrapper.getByText(/Follow/)).toBeVisible();
    expect(
      wrapper.getByRole('link', { name: 'standard editing policy' }),
    ).toBeVisible();
  });

  it('displays ALLOWED_WITH_RESTRICTIONS editing restriction', async () => {
    const wrapper = render(
      <EditingRestrictionsLabel permission="ALLOWED_WITH_RESTRICTIONS" />,
    );
    expect(
      wrapper.getByText(/Additional restrictions apply as well as/),
    ).toBeVisible();
    expect(
      wrapper.getByRole('link', { name: 'standard editing policy' }),
    ).toBeVisible();
  });

  it('displays NOT_ALLOWED editing restriction', async () => {
    const wrapper = render(
      <EditingRestrictionsLabel permission="NOT_ALLOWED" />,
    );

    expect(
      wrapper.getByText('Full Restrictions in place. No editing allowed'),
    ).toBeVisible();
  });

  it('displays editing request form link when editing is allowed with restriction', async () => {
    const wrapper = render(
      <EditingRestrictionsLabel permission="ALLOWED_WITH_RESTRICTIONS" />,
    );
    expect(wrapper.getByText(/Submit an editing request/)).toBeVisible();
    expect(wrapper.getByRole('link', { name: 'here' })).toBeVisible();
  });
});
