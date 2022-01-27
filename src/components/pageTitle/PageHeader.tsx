import React from 'react';
import s from './style.module.less';

interface Props {
  title: string;
  button?: React.ReactNode;
}

const PageHeader = ({ title, button }: Props) => {
  return (
    <div className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 flex flex-row justify-between">
      <div className={`${s.title} text-2xl`}>{title}</div>
      {button}
    </div>
  );
};

export default PageHeader;
