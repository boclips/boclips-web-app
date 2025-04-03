import * as EmailValidator from 'email-validator';
import PasswordValidator from 'password-validator';
import { DistrictRegistrationData } from 'src/components/classroom/registration/district/registrationForm/DistrictRegistrationForm';

type SetError = (
  fieldName: string,
  isError: boolean,
  errorMessage?: string,
) => void;

type ValidationMethod = (fieldName: string, errorMessage: string) => boolean;

interface FormValidatorClass {
  new (registrationData: DistrictRegistrationData, setError: SetError);
}

interface FormValidatorInstance {
  checkIsNotEmpty: ValidationMethod;
  checkArrayIsNotEmpty: ValidationMethod;
  checkHasEmailFormat: ValidationMethod;
  checkPasswordIsStrong: ValidationMethod;
  checkPasswordConfirmed: ValidationMethod;
  checkEducationalUseAgreementValid: ValidationMethod;
}

const FormValidator: FormValidatorClass = class
  implements FormValidatorInstance
{
  private registrationData: DistrictRegistrationData;

  private setError: SetError;

  constructor(registrationData: DistrictRegistrationData, setError: SetError) {
    this.registrationData = registrationData;
    this.setError = setError;
  }

  checkIsNotEmpty(fieldName: string, errorMessage: string): boolean {
    if (!this.registrationData[fieldName]) {
      this.setError(fieldName, true, errorMessage);
      return false;
    }

    this.setError(fieldName, false, '');
    return true;
  }

  checkArrayIsNotEmpty(fieldName: string, errorMessage: string): boolean {
    if (
      !this.registrationData[fieldName] ||
      this.registrationData[fieldName].length === 0
    ) {
      this.setError(fieldName, true, errorMessage);
      return false;
    }

    this.setError(fieldName, false, '');
    return true;
  }

  checkHasEmailFormat(fieldName: string, errorMessage: string): boolean {
    if (!EmailValidator.validate(this.registrationData[fieldName])) {
      this.setError(fieldName, true, errorMessage);
      return false;
    }

    this.setError(fieldName, false, '');
    return true;
  }

  checkPasswordIsStrong(): boolean {
    const schema = new PasswordValidator();

    /* eslint-disable */
    schema
      .is()
      .min(8)
      .has()
      .digits()
      .has()
      .letters()
      .has()
      .symbols()
      .has()
      .not()
      .spaces();
    /* eslint-enable  */

    if (!schema.validate(this.registrationData.password)) {
      this.setError('password', true, '');
      return false;
    }

    this.setError('password', false, '');
    return true;
  }

  checkPasswordConfirmed(): boolean {
    if (
      this.registrationData.password !== this.registrationData.confirmPassword
    ) {
      this.setError('confirmPassword', true, '');
      return false;
    }

    this.setError('confirmPassword', false, '');
    return true;
  }

  checkEducationalUseAgreementValid(): boolean {
    if (!this.registrationData.hasAcceptedEducationalUseTerms) {
      this.setError('hasAcceptedEducationalUseTerms', true, '');
      return false;
    }
    this.setError('hasAcceptedEducationalUseTerms', false, '');
    return true;
  }

  checkTermsAndConditionsAgreementValid(): boolean {
    if (!this.registrationData.hasAcceptedTermsAndConditions) {
      this.setError('hasAcceptedTermsAndConditions', true, '');
      return false;
    }
    this.setError('hasAcceptedTermsAndConditions', false, '');
    return true;
  }

  isValid(): boolean {
    const checks = [
      this.checkIsNotEmpty('state', 'Please select a state'),
      this.checkIsNotEmpty('districtName', 'District name is required'),
      this.checkIsNotEmpty('firstName', 'First name is required'),
      this.checkIsNotEmpty('lastName', 'Last name is required'),
      this.checkIsNotEmpty('email', 'Email is required') &&
        this.checkHasEmailFormat('email', 'Please enter a valid email address'),
      this.checkIsNotEmpty('password', 'Password is required') &&
        this.checkPasswordIsStrong() &&
        this.checkPasswordConfirmed(),
      this.checkIsNotEmpty('usageFrequency', 'Please select a usage frequency'),
      this.checkIsNotEmpty(
        'instructionalVideoSource',
        'Please select an instructional video source',
      ),
      this.checkArrayIsNotEmpty(
        'videoResourceBarriers',
        'Please select one or more barriers',
      ),
      this.checkArrayIsNotEmpty(
        'subjects',
        'Please select one or more subjects',
      ),
      this.checkIsNotEmpty('reason', 'Please select a reason'),
      this.checkEducationalUseAgreementValid(),
      this.checkTermsAndConditionsAgreementValid(),
    ];

    return !checks.some((it) => it === false);
  }
};

export default FormValidator;
