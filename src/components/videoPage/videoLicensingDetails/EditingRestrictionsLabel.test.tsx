import { render } from '@testing-library/react';
import React from 'react';
import { EditingRestrictionsLabel } from 'src/components/videoPage/videoLicensingDetails/EditingRestrictionsLabel';

describe('Editing restrictions label', () => {
  it('displays ALLOWED editing restriction', async () => {
    const wrapper = render(
      <EditingRestrictionsLabel permission="ALLOWED" editingFormLink={null} />,
    );

    expect(wrapper.getByText(/Follow/)).toBeVisible();
    expect(
      wrapper.getByRole('link', { name: 'standard editing policy' }),
    ).toBeVisible();
  });

  it('displays ALLOWED_WITH_RESTRICTIONS editing restriction', async () => {
    const wrapper = render(
      <EditingRestrictionsLabel
        permission="ALLOWED_WITH_RESTRICTIONS"
        editingFormLink={null}
      />,
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
      <EditingRestrictionsLabel
        permission="NOT_ALLOWED"
        editingFormLink={null}
      />,
    );

    expect(
      wrapper.getByText('Full Restrictions in place. No editing allowed'),
    ).toBeVisible();
  });

  it('displays editing request form link when editing is allowed with restriction', async () => {
    const wrapper = render(
      <EditingRestrictionsLabel
        permission="ALLOWED_WITH_RESTRICTIONS"
        editingFormLink={<a href="example.com">here</a>}
      />,
    );
    expect(wrapper.getByText(/Submit an editing request/)).toBeVisible();
    expect(wrapper.getByRole('link', { name: 'here' })).toBeVisible();
  });
});
