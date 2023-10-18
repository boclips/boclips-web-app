import { fireEvent, RenderResult, within } from '@testing-library/react';
import { RegistrationData } from 'src/components/registration/RegistrationForm';

export function fillRegistrationFormData(
  wrapper: RenderResult,
  data: RegistrationData,
) {
  return fillRegistrationForm(
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

export function fillRegistrationForm(
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

  const jobTitleDropdown = wrapper.getByTestId('input-dropdown-job-title');
  fireEvent.click(within(jobTitleDropdown).getByTestId('select'));
  within(jobTitleDropdown)
    .findByText(jobTitle)
    .then((option) => fireEvent.click(option));

  const countryDropdown = wrapper.getByTestId('input-dropdown-country');
  fireEvent.click(within(countryDropdown).getByTestId('select'));
  within(countryDropdown)
    .findByText(country)
    .then((option) => fireEvent.click(option));

  const typeOfOrgDropdown = wrapper.getByTestId('input-dropdown-type-of-org');
  fireEvent.click(within(typeOfOrgDropdown).getByTestId('select'));
  within(typeOfOrgDropdown)
    .findByText(typeOfOrg)
    .then((option) => fireEvent.click(option));

  const audienceDropdown = wrapper.getByTestId('input-dropdown-audience');
  fireEvent.click(within(audienceDropdown).getByTestId('select'));
  within(audienceDropdown)
    .findByText(audience)
    .then((option) => fireEvent.click(option));

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
