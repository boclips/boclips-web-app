import React from 'react';
import { Typography } from '@boclips-ui/typography';

export const DisciplineHeader: React.FC = () => {
  return (
    <Typography.H1
      className="text-center"
      size={{ mobile: 'md', tablet: 'lg', desktop: 'xl' }}
    >
      Let’s find the videos you need
    </Typography.H1>
  );
};
