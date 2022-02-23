import React from 'react';
import { Typography } from '@boclips-ui/typography';

interface Props {
  isMobileView: boolean;
  title: string;
}

export const DisciplineTileTitle: React.FC<Props> = ({
  isMobileView,
  title,
}: Props) => {
  return isMobileView ? (
    <Typography.Body weight="medium" className="flex items-center w-full">
      {title}
    </Typography.Body>
  ) : (
    <Typography.H5 className="flex items-center w-full pt-4 justify-center">
      {title}
    </Typography.H5>
  );
};
