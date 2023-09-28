import React, { useRef, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import { InputText } from '@boclips-ui/input';
import Button from '@boclips-ui/button';
import { useAddNewTrialUser } from 'src/hooks/api/userQuery';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm = () => {
  const { mutate: createTrialUser } = useAddNewTrialUser();

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = (fieldName, value) => {
    if (!value) return;
    setRegistrationData((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  };

  const handleUserCreation = () => {
    createTrialUser(
      {
        email: registrationData.email,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        password: registrationData.password,
        type: UserType.trialB2bUser,
      },
      {
        onSuccess: (user: User) => {
          displayNotification(
            'success',
            `User ${user.email} successfully created`,
          );
          clearInputs();
        },
        onError: () => displayNotification('error', 'User creation failed'),
      },
    );
  };

  const clearInputs = () => {
    firstNameRef.current.value = '';
    lastNameRef.current.value = '';
    emailRef.current.value = '';
    passwordRef.current.value = '';
    confirmPasswordRef.current.value = '';
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
            ref={firstNameRef}
          />
          <InputText
            id="input-last-name"
            onChange={(value) => handleChange('lastName', value)}
            inputType="text"
            placeholder="Your Last name*"
            ref={lastNameRef}
          />
        </div>
        <InputText
          id="input-email"
          onChange={(value) => handleChange('email', value)}
          inputType="email"
          placeholder="Your Professional Email*"
          ref={emailRef}
        />
        <InputText
          id="input-password"
          onChange={(value) => handleChange('password', value)}
          inputType="text"
          placeholder="Password*"
          ref={passwordRef}
        />
        <InputText
          id="input-confirm-password"
          onChange={(value) => handleChange('confirmPassword', value)}
          inputType="text"
          placeholder="Confirm Password*"
          ref={confirmPasswordRef}
        />
        <Typography.Body size="small">
          By clicking Create Account, you agree to the Boclips User Agreement,
          Privacy Policy, and Cookie Policy.
        </Typography.Body>
        <Button onClick={handleUserCreation} text="Create Account" />
      </section>
    </main>
  );
};

export default RegistrationForm;
