import { fireEvent, RenderResult, within } from '@testing-library/react';
import { DistrictRegistrationData } from 'src/components/classroom/registration/district/registrationForm/DistrictRegistrationForm';
import userEvent from '@testing-library/user-event';

export async function fillRegistrationForm(
  wrapper: RenderResult,
  data: DistrictRegistrationData,
) {
  await setTextFieldValue(
    wrapper.container.querySelector('[id="input-firstName"]'),
    data.firstName,
  );
  await setTextFieldValue(
    wrapper.container.querySelector('[id="input-lastName"]'),
    data.lastName,
  );
  await setTextFieldValue(
    wrapper.container.querySelector('[id="input-email"]'),
    data.email,
  );
  await setTextFieldValue(
    wrapper.container.querySelector('[id="input-password"]'),
    data.password,
  );
  await setTextFieldValue(
    wrapper.container.querySelector('[id="input-confirmPassword"]'),
    data.confirmPassword,
  );

  await setDropdownValue(wrapper, 'input-dropdown-state', data.state);

  await setDropdownValue(
    wrapper,
    'input-dropdown-districtName',
    data.districtName,
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
    const combobox = within(wrapper.getByTestId(dropdownId)).getByRole(
      'combobox',
    );
    await userEvent.clear(combobox);
    await userEvent.type(combobox, value);

    const option = await wrapper.findByText(value);
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

export const setTextFieldValue = async (field: Element, text: string) => {
  if (text !== '') {
    await userEvent.clear(field);
    await userEvent.type(field, text);
  }
};
