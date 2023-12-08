import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import s from 'src/components/registration/style.module.less';
import React from 'react';

const AcceptedAgreement = () => {
  return (
    <Typography.Body
      data-qa="accepted-agreement"
      size="small"
      className={c(s.grayText, 'mt-8')}
    >
      By clicking Create Account, you agree to the{' '}
      <a
        rel="noopener noreferrer"
        className={s.link}
        href="https://www.boclips.com/terms-and-conditions"
        target="_blank"
      >
        <Typography.Body size="small">
          <Typography.Link type="inline-blue">
            Boclips Terms &amp; Conditions
          </Typography.Link>
        </Typography.Body>
      </a>{' '}
      and{' '}
      <a
        rel="noopener noreferrer"
        className={s.link}
        href="https://www.boclips.com/privacy-policy"
        target="_blank"
      >
        <Typography.Body size="small">
          <Typography.Link type="inline-blue">
            Boclips Privacy Policy
          </Typography.Link>
        </Typography.Body>
      </a>
    </Typography.Body>
  );
};

export default AcceptedAgreement;
