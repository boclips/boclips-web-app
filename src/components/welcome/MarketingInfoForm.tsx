import React, { useCallback, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import Dropdown from '@boclips-ui/dropdown';
import { AUDIENCE } from 'src/components/registration/dropdownValues';
import { InputText } from '@boclips-ui/input';
import Button from '@boclips-ui/button';
import s from './style.module.less';

interface MarketingInfo {
  audience: string;
  desiredContent: string;
  jobTitle: string;
}

const MarketingInfoForm = () => {
  const [marketingInfo, setMarketingInfo] = useState<MarketingInfo>({
    audience: '',
    desiredContent: '',
    jobTitle: '',
  });

  const handleChange = useCallback((fieldName: string, value: string) => {
    setMarketingInfo((prevState) => ({
      ...prevState,
      [fieldName]: value.trim(),
    }));
  }, []);

  return (
    <>
      <main tabIndex={-1} className={s.marketingInfoWrapper}>
        <Typography.Body size="small">
          To complete the setup of your account, we require a few additional
          details (all fields marked * are mandatory).
        </Typography.Body>
        <InputText
          id="input-jobTitle"
          aria-label="input-jobTitle"
          onChange={(value) => handleChange('jobTitle', value)}
          inputType="text"
          placeholder="example: Designer"
          className={s.input}
          labelText="Job Title*"
          height="48px"
        />
        <Dropdown
          mode="single"
          labelText="Your audience type*"
          onUpdate={(value: string) => handleChange('audience', value)}
          options={AUDIENCE}
          dataQa="input-dropdown-audience"
          placeholder="example: K12"
          showLabel
          fitWidth
        />
        <InputText
          id="input-desiredContent"
          aria-label="input-desiredContent"
          onChange={(value) => handleChange('desiredContent', value)}
          inputType="text"
          placeholder="Design"
          className={s.input}
          labelText="What Content are you interested in*"
          height="48px"
        />
        <div className={s.line} />
        <Typography.Body size="small">
          By clicking Create Account, you agree to the{' '}
          <Typography.Link type="inline-blue">
            <a href="https://www.boclips.com/terms-and-conditions">
              Boclips Terms & Conditions
            </a>
          </Typography.Link>{' '}
          and{' '}
          <Typography.Link type="inline-blue">
            <a href="https://www.boclips.com/privacy-policy">Privacy Policy</a>
          </Typography.Link>
        </Typography.Body>
      </main>
      <section className={s.updateMarketingInfoButtonWrapper}>
        <Button
          onClick={() => {
            console.log(marketingInfo);
          }}
          text="Create Account"
          className={s.updateMarketingInfoButton}
        />
      </section>
    </>
  );
};

export default MarketingInfoForm;
