import { Typography } from '@boclips-ui/typography';
import React from 'react';
import s from './style.module.less';

interface Props {
  title: string;
  button?: React.ReactNode;
  cartItems?: React.ReactNode;
  description?: React.ReactNode;
}

const PageHeader = ({ title, button, cartItems, description }: Props) => {
  return (
    <section className={s.header} aria-labelledby="page-header">
      <div className={s.title}>
        <Typography.H1
          id="page-header"
          size="md"
          title={title}
          className="text-gray-900 mb-2 lg:mb-0"
        >
          {title} {cartItems}
        </Typography.H1>
        <div className={s.description}>
          <Typography.Body>{description}</Typography.Body>
        </div>
      </div>
      {button}
    </section>
  );
};

export default PageHeader;
