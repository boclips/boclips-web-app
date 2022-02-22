import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';

const text = 'Let’s find the videos you need';

export const DisciplineHeader: React.FC = () => {
  const device = useMediaBreakPoint();

  switch (device.type) {
    case 'mobile':
      return <Typography.H3 className="text-center">{text}</Typography.H3>;
    case 'tablet':
      return <Typography.H2 className="text-center">{text}</Typography.H2>;
    default:
      return <Typography.H1 className="text-center">{text}</Typography.H1>;
  }
};
