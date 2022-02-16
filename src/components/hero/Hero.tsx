import React from 'react';
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
    <>
      <div
        className={`${s.heroWrapper} col-start-2 col-end-26 row-start-${row} row-end-${row} bg-primary-light rounded-lg`}
      />
      <div
        className={`${s.svgWrapper} col-start-4 col-end-12 row-start-${row} row-end-${row} flex justify-center items-center`}
      >
        {icon}
      </div>
      <main
        className={`${s.heroCopyWrapper} col-start-13 col-end-24 lg:col-start-13 lg:col-end-22 row-start-${row} row-end-${row} text-blue-800 flex flex-col justify-center`}
      >
        <h2 className="blue-800 font-medium text-4xl">{title}</h2>
        {description && (
          <p className="text-gray-800 text-lg" data-qa="description">
            {description}
          </p>
        )}
        {moreDescription && (
          <p className="text-gray-800 text-lg mt-6">{moreDescription}</p>
        )}
        {actions && (
          <div className="mt-8 flex flex-row items-center">{actions}</div>
        )}
      </main>
    </>
  );
};
