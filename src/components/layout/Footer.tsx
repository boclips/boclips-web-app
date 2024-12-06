import React from 'react';
import { Typography } from 'boclips-ui';
import c from 'classnames';
import { FeatureGate } from '@components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { Constants } from '@src/AppConstants';
import s from './footer.module.less';

interface Props {
  className?: string;
  termsAndConditionsLink?: string;
}

const Footer = ({ className, termsAndConditionsLink }: Props) => {
  const currentDate = new Date();

  return (
    <footer className={c(`${className}`, s.footer)} aria-label="Boclips footer">
      <Typography.Body
        size="small"
        as="div"
        className="flex flex-row items-center"
      >
        Copyright © {currentDate.getFullYear()} Boclips. All rights reserved.
        {termsAndConditionsLink ? (
          getTermsAndConditionsLink(termsAndConditionsLink)
        ) : (
          <FeatureGate
            product={Product.CLASSROOM}
            fallback={getTermsAndConditionsLink(
              Constants.LIBRARY_TERMS_AND_CONDITIONS_LINK,
            )}
          >
            {getTermsAndConditionsLink(
              Constants.CLASSROOM_TERMS_AND_CONDITIONS_LINK,
            )}
          </FeatureGate>
        )}
        <a
          rel="noopener noreferrer"
          className={s.link}
          href="https://www.boclips.com/privacy-policy"
          target="_blank"
        >
          <Typography.Body size="small" weight="medium">
            <Typography.Link type="inline-blue">Privacy Policy</Typography.Link>
          </Typography.Body>
        </a>
      </Typography.Body>

      <Typography.Body size="small">
        All trademarks, service marks, trade names, product names and logos
        appearing on the site are the property of their respective owners. Any
        rights not expressly granted herein are reserved.
      </Typography.Body>
    </footer>
  );
};

const getTermsAndConditionsLink = (link: string) => (
  <a rel="noopener noreferrer" className={s.link} href={link} target="_blank">
    <Typography.Body size="small" weight="medium">
      <Typography.Link type="inline-blue">
        Terms &amp; Conditions
      </Typography.Link>
    </Typography.Body>
  </a>
);

export default Footer;
