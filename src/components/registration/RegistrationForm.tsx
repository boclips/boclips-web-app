import React, { useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import { InputText } from '@boclips-ui/input';
import Button from '@boclips-ui/button';

interface Props {
  onSubmit: (registrationData: RegistrationData) => void;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm = ({ onSubmit }: Props) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (fieldName, value) => {
    if (!value) return;
    setRegistrationData((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  };

  return (
    <main tabIndex={-1} className="col-start-2 col-end-26">
      <section className="flex flex-col items-center">
        <Typography.H1>CourseSpark</Typography.H1>
        <Typography.Body>Create new account</Typography.Body>
        <Typography.Body size="small">30 day trial</Typography.Body>
        <div className="flex flex-row">
          <InputText
            id="input-first-name"
            onChange={(value) => handleChange('firstName', value)}
            inputType="text"
            placeholder="Your First name*"
          />
          <InputText
            id="input-last-name"
            onChange={(value) => handleChange('lastName', value)}
            inputType="text"
            placeholder="Your Last name*"
          />
        </div>
        <InputText
          id="input-email"
          onChange={(value) => handleChange('email', value)}
          inputType="email"
          placeholder="Your Professional Email*"
        />
        <InputText
          id="input-password"
          onChange={(value) => handleChange('password', value)}
          inputType="text"
          placeholder="Password*"
        />
        <InputText
          id="input-confirm-password"
          onChange={(value) => handleChange('confirmPassword', value)}
          inputType="text"
          placeholder="Confirm Password*"
        />
        <Typography.Body size="small">
          By clicking Create Account, you agree to the Boclips User Agreement,
          Privacy Policy, and Cookie Policy.
        </Typography.Body>
        <Button
          onClick={() => {
            onSubmit(registrationData);
          }}
          text="Create Account"
        />
      </section>
    </main>
  );
};

export default RegistrationForm;
