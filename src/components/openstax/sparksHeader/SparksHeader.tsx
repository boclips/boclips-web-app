import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

const SparksHeader = () => {
  return (
    <section
      className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 mt-2 flex flex-col md:flex-row"
      aria-labelledby="page-header"
    >
      <div className="flex grow flex-col space-y-2 md:space-y-4 mb-4">
        <Typography.H1 size="lg" id="page-header">
          Our OpenStax collection
        </Typography.H1>

        <Typography.H2 size="xs" weight="regular">
          Explore our video library, expertly curated for your ebook
        </Typography.H2>
      </div>
      <img
        alt="We're an OpenStax ally"
        className={s.openStaxAllyLogo}
        src="https://assets.boclips.com/boclips-public-static-files/boclips/openstax/openstax_ally_logo.png"
      />
    </section>
  );
};

export default SparksHeader;
