import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  title: string;
}

export const DisciplineTileTitle: React.FC<Props> = ({ title }: Props) => {
  return (
    <Typography.H2 size="xs" weight="regular" className={s.disciplineTitle}>
      {title}
      <span className="sr-only"> discipline</span>
    </Typography.H2>
  );
};
