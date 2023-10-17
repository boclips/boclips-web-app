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
  fireEvent.change(wrapper.getByLabelText('First name'), {
    target: { value: firstName },
  });
  fireEvent.change(wrapper.getByLabelText('Last name'), {
    target: { value: lastName },
  });
  fireEvent.change(wrapper.getByLabelText('Professional email'), {
    target: { value: email },
  });
  fireEvent.change(wrapper.getByLabelText('Password'), {
    target: { value: password },
  });
  fireEvent.change(wrapper.getByLabelText('Confirm password'), {
    target: { value: confirmPassword },
  });
  fireEvent.change(wrapper.getByLabelText('Account name'), {
    target: { value: accountName },
  });

  const jobTitleDropdown = wrapper.getByTestId('input-dropdown-job-title');
  fireEvent.click(within(jobTitleDropdown).getByTestId('select'));
  fireEvent.click(within(jobTitleDropdown).getByText(jobTitle));

  const countryDropdown = wrapper.getByTestId('input-dropdown-country');
  fireEvent.click(within(countryDropdown).getByTestId('select'));
  fireEvent.click(within(countryDropdown).getByText(country));

  const typeOfOrgDropdown = wrapper.getByTestId('input-dropdown-type-of-org');
  fireEvent.click(within(typeOfOrgDropdown).getByTestId('select'));
  fireEvent.click(within(typeOfOrgDropdown).getByText(typeOfOrg));

  const audienceDropdown = wrapper.getByTestId('input-dropdown-audience');
  fireEvent.click(within(audienceDropdown).getByTestId('select'));
  fireEvent.click(within(audienceDropdown).getByText(audience));

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
