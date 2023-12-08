import * as EmailValidator from 'email-validator';
import PasswordValidator from 'password-validator';
import { RegistrationData } from 'src/components/registration/registrationForm/RegistrationForm';

type SetError = (fieldName: string, errorMessage: string | boolean) => void;

type ValidationMethod = (
  fieldName: string,
  errorMessage: string | boolean,
) => boolean;

interface FormValidatorClass {
  new (registrationData: RegistrationData, setError: SetError);
}

interface FormValidatorInstance {
  checkIsNotEmpty: ValidationMethod;
  checkHasEmailFormat: ValidationMethod;
  checkPasswordIsStrong: ValidationMethod;
  checkPasswordConfirmed: ValidationMethod;
  checkEducationalUseAgreementValid: ValidationMethod;
}

const FormValidator: FormValidatorClass = class
  implements FormValidatorInstance
{
  private registrationData: RegistrationData;

  private setError: SetError;

  constructor(registrationData: RegistrationData, setError: SetError) {
    this.registrationData = registrationData;
    this.setError = setError;
  }

  checkIsNotEmpty(fieldName: string, errorMessage: string): boolean {
    if (!this.registrationData[fieldName]) {
      this.setError(fieldName, errorMessage);
      return false;
    }

    this.setError(fieldName, '');
    return true;
  }

  checkHasEmailFormat(fieldName: string, errorMessage: string): boolean {
    if (!EmailValidator.validate(this.registrationData[fieldName])) {
      this.setError(fieldName, errorMessage);
      return false;
    }

    this.setError(fieldName, '');
    return true;
  }

  checkPasswordIsStrong(): boolean {
    const schema = new PasswordValidator();

    /* eslint-disable */
        schema
            .is().min(8)
            .has().digits()
            .has().letters()
            .has().symbols()
            .has().not().spaces();
        /* eslint-enable  */

    if (!schema.validate(this.registrationData.password)) {
      this.setError('password', ' ');
      return false;
    }

    this.setError('password', '');
    return true;
  }

  checkPasswordConfirmed(): boolean {
    if (
      this.registrationData.password !== this.registrationData.confirmPassword
    ) {
      this.setError('confirmPassword', ' ');
      return false;
    }

    this.setError('confirmPassword', '');
    return true;
  }

  checkEducationalUseAgreementValid(): boolean {
    if (!this.registrationData.hasAcceptedEducationalUseTerms) {
      this.setError('hasAcceptedEducationalUseTerms', true);
      return false;
    }
    this.setError('hasAcceptedEducationalUseTerms', false);
    return true;
  }

  isValid(): boolean {
    const checks = [
      this.checkIsNotEmpty('firstName', 'First name is required'),
      this.checkIsNotEmpty('lastName', 'Last name is required'),
      this.checkIsNotEmpty('email', 'Email is required') &&
        this.checkHasEmailFormat('email', 'Please enter a valid email address'),
      this.checkIsNotEmpty('accountName', 'Account name is required'),
      this.checkIsNotEmpty('password', 'Password is required') &&
        this.checkPasswordIsStrong() &&
        this.checkPasswordConfirmed(),
      this.checkIsNotEmpty('country', 'Please select a country'),
      this.checkEducationalUseAgreementValid(),
    ];

    return !checks.some((it) => it === false);
  }
};

export default FormValidator;
