import { Typography } from '@boclips-ui/typography';
import React from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  row?: string;
  title: string;
  description?: React.ReactNode;
  moreDescription?: string;
  icon: React.ReactNode;
  actions?: React.ReactNode;
}

export const Hero = ({
  title,
  description,
  actions,
  icon,
  moreDescription,
  row = '2',
}: Props) => {
  return (
    <main
      tabIndex={-1}
      className={`${s.heroWrapper} col-start-2 col-end-26 row-start-${row} row-end-${row} text-blue-800 flex flex-row justify-around`}
    >
      <section className={`${s.svgWrapper} flex justify-center items-center`}>
        {icon}
      </section>
      <section className={c(s.heroCopyWrapper, 'flex flex-col justify-center')}>
        <Typography.H1 size="lg" className="blue-800 ">
          {title}
        </Typography.H1>
        {description && (
          <Typography.Body
            as="p"
            className="text-gray-800"
            data-qa="description"
          >
            {description}
          </Typography.Body>
        )}
        {moreDescription && (
          <Typography.Body as="p" className="text-gray-800 mt-6">
            {moreDescription}
          </Typography.Body>
        )}
        {actions && (
          <div className="mt-8 flex flex-row items-center">{actions}</div>
        )}
      </section>
    </main>
  );
};
