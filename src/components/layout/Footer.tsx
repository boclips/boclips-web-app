import React from 'react';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import s from './footer.module.less';

interface Props {
  columnPosition?: string;
}

const Footer = ({ columnPosition }: Props) => {
  return (
    <footer
      className={c(`${columnPosition}`, s.footer)}
      aria-label="Boclips footer"
    >
      <div className="flex flex-row items-center">
        <Typography.Body size="small">
          Copyright © 2021 Boclips. All rights reserved.
        </Typography.Body>
        <a
          rel="noopener noreferrer"
          className={c(s.link, 'inline-blue')}
          href="https://www.boclips.com/terms-and-conditions"
          target="_blank"
        >
          <Typography.Body size="small" weight="medium">
            Terms &amp; Conditions
          </Typography.Body>
        </a>
        <a
          rel="noopener noreferrer"
          className={c(s.link, 'inline-blue')}
          href="https://www.boclips.com/privacy-policy"
          target="_blank"
        >
          <Typography.Body size="small" weight="medium">
            Privacy Policy
          </Typography.Body>
        </a>
      </div>

      <Typography.Body size="small">
        All trademarks, service marks, trade names, product names and logos
        appearing on the site are the property of their respective owners. Any
        rights not expressly granted herein are reserved.
      </Typography.Body>
    </footer>
  );
};

export default Footer;
