import { fireEvent, RenderResult, within } from '@testing-library/react';
import { ClassroomRegistrationData } from 'src/components/classroom/registration/registrationForm/ClassroomRegistrationForm';
import userEvent from '@testing-library/user-event';

export async function fillRegistrationForm(
  wrapper: RenderResult,
  data: ClassroomRegistrationData,
) {
  await userEvent.type(
    wrapper.container.querySelector('[id="input-firstName"]'),
    data.firstName,
  );

  await userEvent.type(
    wrapper.container.querySelector('[id="input-lastName"]'),
    data.lastName,
  );
  await userEvent.type(
    wrapper.container.querySelector('[id="input-email"]'),
    data.email,
  );
  await userEvent.type(
    wrapper.container.querySelector('[id="input-password"]'),
    data.password,
  );
  await userEvent.type(
    wrapper.container.querySelector('[id="input-confirmPassword"]'),
    data.confirmPassword,
  );

  await setDropdownValue(wrapper, 'input-dropdown-country', data.country);

  await setDropdownValue(wrapper, 'input-dropdown-state', data.state);

  await userEvent.type(
    wrapper.container.querySelector('[id="input-schoolName"]'),
    data.schoolName,
  );

  if (data.hasAcceptedEducationalUseTerms) {
    checkEducationalUseAgreement(wrapper);
  }

  if (data.hasAcceptedTermsAndConditions) {
    checkTermsAndConditions(wrapper);
  }
}

export async function setDropdownValue(
  wrapper: RenderResult,
  dropdownId: string,
  value: string,
) {
  if (value) {
    const dropdown = wrapper.getByTestId(dropdownId);
    await userEvent.type(within(dropdown).getByRole('combobox'), value);
    const option = wrapper.getByText(value);
    expect(option).toBeVisible();
    await userEvent.click(option);
  }
}

const checkEducationalUseAgreement = (wrapper: RenderResult) => {
  fireEvent.click(
    wrapper.getByLabelText(
      /I certify that I am accessing this service solely for Educational Use./,
    ),
  );
};

const checkTermsAndConditions = (wrapper: RenderResult) => {
  fireEvent.click(
    wrapper.getByLabelText(
      /I understand that by checking this box, I am agreeing to the Boclips Terms & Conditions/,
    ),
  );
};
