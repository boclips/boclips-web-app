import React from 'react';
import s from './style.module.less';

interface Props {
  title: string;
  button?: React.ReactNode;
  cartItems?: React.ReactNode;
}

const PageHeader = ({ title, button, cartItems }: Props) => {
  return (
    <section className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 flex flex-row justify-between">
      <h2 className={`${s.title} text-2xl`}>
        {title} {cartItems}
      </h2>
      {button}
    </section>
  );
};

export default PageHeader;
