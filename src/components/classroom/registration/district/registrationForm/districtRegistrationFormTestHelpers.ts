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

  await setComboboxDropdownValue(wrapper, 'input-dropdown-state', data.state);

  await setComboboxDropdownValue(
    wrapper,
    'input-dropdown-districtName',
    data.districtName,
  );

  await setTextFieldValue(
    wrapper.container.querySelector('[id="input-password"]'),
    data.password,
  );
  await setTextFieldValue(
    wrapper.container.querySelector('[id="input-confirmPassword"]'),
    data.confirmPassword,
  );

  await setComboboxDropdownValue(
    wrapper,
    'input-dropdown-usageFrequency',
    data.usageFrequency,
  );

  await setComboboxDropdownValue(
    wrapper,
    'input-dropdown-instructionalVideoSource',
    data.instructionalVideoSource,
  );

  await setMultiComboboxDropdownValue(
    wrapper,
    'input-dropdown-videoResourceBarriers',
    data.videoResourceBarriers[0],
  );

  await setMultiComboboxDropdownValue(
    wrapper,
    'input-dropdown-subjects',
    data.subjects[0],
  );

  await setComboboxDropdownValue(wrapper, 'input-dropdown-reason', data.reason);

  if (data.hasAcceptedEducationalUseTerms) {
    checkEducationalUseAgreement(wrapper);
  }

  if (data.hasAcceptedTermsAndConditions) {
    checkTermsAndConditions(wrapper);
  }
}

export async function setComboboxDropdownValue(
  wrapper: RenderResult,
  dropdownId: string,
  value: string,
) {
  if (value) {
    const byTestId = wrapper.getByTestId(dropdownId);
    const combobox = await within(byTestId).findByRole('combobox');
    await userEvent.clear(combobox);
    await userEvent.type(combobox, value);

    const option = await wrapper.findByText(value);
    expect(option).toBeVisible();
    await userEvent.click(option);
  }
}

export async function setMultiComboboxDropdownValue(
  wrapper: RenderResult,
  dropdownId: string,
  value: string,
) {
  if (value) {
    const combobox = await within(wrapper.getByTestId(dropdownId)).findByRole(
      'combobox',
    );
    await userEvent.clear(combobox);
    await userEvent.type(combobox, value);

    const option = await wrapper.findByText(value);
    expect(option).toBeVisible();
    await userEvent.click(option);
    await userEvent.tab();
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
