import { fireEvent, RenderResult, within } from '@testing-library/react';
import { ClassroomRegistrationData } from 'src/components/classroom/registration/user/registrationForm/ClassroomRegistrationForm';
import userEvent from '@testing-library/user-event';

export enum SchoolMode {
  FREE_TEXT,
  DROPDOWN_VALUE,
  CUSTOM_VALUE,
}

export async function fillRegistrationForm(
  wrapper: RenderResult,
  data: ClassroomRegistrationData,
  schoolMode: SchoolMode,
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

  await setDropdownValue(wrapper, 'input-dropdown-country', data.country);

  await setDropdownValue(wrapper, 'input-dropdown-state', data.state);

  switch (schoolMode) {
    case SchoolMode.FREE_TEXT:
      await setTextFieldValue(
        wrapper.container.querySelector('[id="input-schoolName"]'),
        data.schoolName,
      );
      break;
    case SchoolMode.DROPDOWN_VALUE:
      await setDropdownValue(
        wrapper,
        'input-dropdown-schoolName',
        data.schoolName,
      );
      break;
    case SchoolMode.CUSTOM_VALUE:
      await setCustomComboBoxValue(
        wrapper,
        'input-dropdown-schoolName',
        data.schoolName,
      );
      break;
    default:
  }

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

export async function setCustomComboBoxValue(
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

    const option = await wrapper.findByTestId(`${dropdownId}-custom-option`);
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
