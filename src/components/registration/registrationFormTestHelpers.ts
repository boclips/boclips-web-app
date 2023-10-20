import { fireEvent, RenderResult, within } from '@testing-library/react';
import { RegistrationData } from 'src/components/registration/RegistrationForm';

export function fillRegistrationForm(
  wrapper: RenderResult,
  data: RegistrationData,
) {
  fireEvent.change(wrapper.container.querySelector('[id="input-firstName"]'), {
    target: { value: data.firstName },
  });

  fireEvent.change(wrapper.container.querySelector('[id="input-lastName"]'), {
    target: { value: data.lastName },
  });
  fireEvent.change(wrapper.container.querySelector('[id="input-email"]'), {
    target: { value: data.email },
  });
  fireEvent.change(wrapper.container.querySelector('[id="input-password"]'), {
    target: { value: data.password },
  });
  fireEvent.change(
    wrapper.container.querySelector('[id="input-confirmPassword"]'),
    {
      target: { value: data.confirmPassword },
    },
  );
  fireEvent.change(
    wrapper.container.querySelector('[id="input-accountName"]'),
    {
      target: { value: data.accountName },
    },
  );

  setDropdownValue(wrapper, 'input-dropdown-job-title', data.jobTitle);
  setDropdownValue(wrapper, 'input-dropdown-type-of-org', data.typeOfOrg);
  setDropdownValue(wrapper, 'input-dropdown-country', data.country);
  setDropdownValue(wrapper, 'input-dropdown-audience', data.audience);

  fireEvent.change(wrapper.getByLabelText('How did you hear about Boclips?'), {
    target: { value: data.discoveryMethod },
  });

  fireEvent.change(
    wrapper.getByLabelText('What content are you looking for?'),
    {
      target: { value: data.desiredContent },
    },
  );

  if (data.educationalUse) {
    checkEducationalUseAgreement(wrapper);
  }
}

function setDropdownValue(
  wrapper: RenderResult,
  dropdownId: string,
  value: string,
) {
  if (value) {
    const dropdown = wrapper.getByTestId(dropdownId);
    fireEvent.click(within(dropdown).getByTestId('select'));
    const option = within(dropdown).getByText(value);
    expect(option).toBeVisible();
    fireEvent.click(option);
  }
}

const checkEducationalUseAgreement = (wrapper: RenderResult) => {
  fireEvent.click(
    wrapper.getByLabelText(
      'I certify that I am accessing this service solely for Educational Use. ' +
        '"Educational Use" is defined as to copy, communicate, edit, and/or ' +
        'incorporate into a publication or digital product for a learning outcome',
    ),
  );
};
