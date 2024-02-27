import { fireEvent, RenderResult, within } from '@testing-library/react';
import { ClassroomRegistrationData } from 'src/components/classroom/registration/registrationForm/ClassroomRegistrationForm';

export function fillRegistrationForm(
  wrapper: RenderResult,
  data: ClassroomRegistrationData,
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
  fireEvent.change(wrapper.container.querySelector('[id="input-schoolName"]'), {
    target: { value: data.schoolName },
  });

  setDropdownValue(wrapper, 'input-dropdown-country', data.country);

  if (data.hasAcceptedEducationalUseTerms) {
    checkEducationalUseAgreement(wrapper);
  }

  if (data.hasAcceptedTermsAndConditions) {
    checkTermsAndConditions(wrapper);
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
