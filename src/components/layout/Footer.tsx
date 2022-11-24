import React from 'react';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import s from './footer.module.less';

interface Props {
  className?: string;
}

const Footer = ({ className }: Props) => {
  const currentDate = new Date();

  return (
    <footer className={c(`${className}`, s.footer)} aria-label="Boclips footer">
      <Typography.Body
        size="small"
        as="div"
        className="flex flex-row items-center"
      >
        Copyright © {currentDate.getFullYear()} Boclips. All rights reserved.
        <a
          rel="noopener noreferrer"
          className={s.link}
          href="https://www.boclips.com/terms-and-conditions"
          target="_blank"
        >
          <Typography.Body size="small" weight="medium">
            <Typography.Link type="inline-blue">
              Terms &amp; Conditions
            </Typography.Link>
          </Typography.Body>
        </a>
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

export default Footer;
