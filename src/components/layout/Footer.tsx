import React from 'react';

const Footer = () => {
  return (
    <footer
      className="col-start-2 col-end-26 row-start-end row-end-last"
      aria-label="Boclips footer"
    >
      <div className="border-t text-xxs text-footer pt-4 font-thin ">
        <div>
          <span> Copyright © 2020 Boclips. All rights reserved. </span>
          <span className="pl-6">
            <a
              rel="noopener noreferrer"
              className="text-primary-link"
              href="https://www.boclips.com/terms-and-conditions"
              target="_blank"
            >
              Terms &amp; Conditions
            </a>
            &nbsp;•&nbsp;
            <a
              rel="noopener noreferrer"
              className="text-primary-link"
              href="https://www.boclips.com/privacy-policy"
              target="_blank"
            >
              Privacy Policy
            </a>
          </span>
        </div>
        <p>
          All trademarks, service marks, trade names, product names and logos
          appearing on the site are the property of their respective owners. Any
          rights not expressly granted herein are reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
