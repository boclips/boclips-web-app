import {
  fireEvent,
  RenderResult,
  waitFor,
  within,
} from '@testing-library/react';
import { RegistrationData } from 'src/components/registration/RegistrationForm';

export async function fillRegistrationFormData(
  wrapper: RenderResult,
  data: RegistrationData,
) {
  await fillRegistrationForm(
    wrapper,
    data.firstName,
    data.lastName,
    data.email,
    data.password,
    data.confirmPassword,
    data.accountName,
    data.jobTitle,
    data.country,
    data.typeOfOrg,
    data.audience,
    data.discoveryMethod,
    data.desiredContent,
  );
}

export async function fillRegistrationForm(
  wrapper: RenderResult,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  accountName: string,
  jobTitle: string,
  country: string,
  typeOfOrg: string,
  audience: string,
  discoveryMethod: string,
  desiredContent: string,
) {
  fireEvent.change(wrapper.container.querySelector('[id="input-firstName"]'), {
    target: { value: firstName },
  });

  fireEvent.change(wrapper.container.querySelector('[id="input-lastName"]'), {
    target: { value: lastName },
  });
  fireEvent.change(wrapper.container.querySelector('[id="input-email"]'), {
    target: { value: email },
  });
  fireEvent.change(wrapper.container.querySelector('[id="input-password"]'), {
    target: { value: password },
  });
  fireEvent.change(
    wrapper.container.querySelector('[id="input-confirmPassword"]'),
    {
      target: { value: confirmPassword },
    },
  );
  fireEvent.change(
    wrapper.container.querySelector('[id="input-accountName"]'),
    {
      target: { value: accountName },
    },
  );

  await setDropdownValue(wrapper, 'input-dropdown-job-title', jobTitle);
  await setDropdownValue(wrapper, 'input-dropdown-type-of-org', typeOfOrg);
  await setDropdownValue(wrapper, 'input-dropdown-country', country);
  await setDropdownValue(wrapper, 'input-dropdown-audience', audience);

  fireEvent.change(wrapper.getByLabelText('How did you hear about Boclips?'), {
    target: { value: discoveryMethod },
  });

  fireEvent.change(
    wrapper.getByLabelText('What content are you looking for?'),
    {
      target: { value: desiredContent },
    },
  );
}

async function setDropdownValue(
  wrapper: RenderResult,
  dropdownId: string,
  value: string,
) {
  if (value) {
    const dropdown = wrapper.getByTestId(dropdownId);
    fireEvent.click(within(dropdown).getByTestId('select'));
    await waitFor(() => {
      const option = within(dropdown).getByText(value);
      fireEvent.click(option);
      expect(option).toBeVisible();
    });
  }
}
