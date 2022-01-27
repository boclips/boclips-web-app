import React from 'react';
import s from './style.module.less';

interface Props {
  title: string;
}

const PageTitle = ({ title }: Props) => {
  return (
    <div className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 flex flex-row">
      <div className={`${s.title} text-2xl`}>{title}</div>
    </div>
  );
};

export default PageTitle;
