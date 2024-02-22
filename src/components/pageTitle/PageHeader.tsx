import { Typography } from '@boclips-ui/typography';
import React from 'react';
import s from './style.module.less';

interface Props {
  title: string;
  button?: React.ReactNode;
  cartItems?: React.ReactNode;
  className?: string;
}

const PageHeader = ({ title, button, cartItems, className }: Props) => {
  const headerClassName = className ? `${s.header} ${className}` : s.header;
  return (
    <section className={headerClassName} aria-labelledby="page-header">
      <Typography.H1
        id="page-header"
        size="md"
        title={title}
        className="text-gray-900 mb-2 lg:mb-0"
      >
        {title} {cartItems}
      </Typography.H1>
      {button}
    </section>
  );
};

export default PageHeader;
