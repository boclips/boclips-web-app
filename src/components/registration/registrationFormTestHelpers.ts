import { RenderResult, within } from '@testing-library/react';
import { RegistrationData } from 'src/components/registration/registrationForm/RegistrationForm';
import userEvent from '@testing-library/user-event';

export async function fillRegistrationForm(
  wrapper: RenderResult,
  data: RegistrationData,
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
  await userEvent.type(
    wrapper.container.querySelector('[id="input-accountName"]'),
    data.accountName,
  );

  await setDropdownValue(wrapper, 'input-dropdown-country', data.country);

  if (data.hasAcceptedEducationalUseTerms) {
    await checkEducationalUseAgreement(wrapper);
  }

  if (data.hasAcceptedTermsAndConditions) {
    await checkTermsAndConditions(wrapper);
  }
}

async function setDropdownValue(
  wrapper: RenderResult,
  dropdownId: string,
  value: string,
) {
  if (value) {
    const dropdown = wrapper.getByTestId(dropdownId);
    await userEvent.click(within(dropdown).getByTestId('select'));
    const option = within(dropdown).getByText(value);
    expect(option).toBeVisible();
    await userEvent.click(option);
  }
}

const checkEducationalUseAgreement = async (wrapper: RenderResult) => {
  await userEvent.click(
    wrapper.getByLabelText(
      /I certify that I am accessing this service solely for Educational Use./,
    ),
  );
};

const checkTermsAndConditions = async (wrapper: RenderResult) => {
  await userEvent.click(
    wrapper.getByLabelText(
      /I understand that by checking this box, I am agreeing to the Boclips Terms & Conditions/,
    ),
  );
};
