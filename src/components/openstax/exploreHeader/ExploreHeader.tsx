import React from 'react';
import { Typography } from '@boclips-ui/typography';

const ExploreHeader = () => {
  return (
    <aside className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 mt-4 text-center">
      <Typography.H1 size="lg">
        Our best content aligned to OpenStax courses
      </Typography.H1>

      <Typography.H2 size="xs" weight="regular">
        Review videos hand-picked by our curators and decide if they are right
        for your course
      </Typography.H2>
    </aside>
  );
};

export default ExploreHeader;
