import { Typography } from '@boclips-ui/typography';
import React from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  title: string;
  subTitle?: string;
  button?: React.ReactNode;
  cartItems?: React.ReactNode;
}

const PageHeader = ({ title, subTitle, button, cartItems }: Props) => {
  return (
    <section
      className={c(s.header, { [s.subtitle]: subTitle })}
      aria-labelledby="page-header"
    >
      <div>
        <Typography.H1
          id="page-header"
          size="md"
          title={title}
          className="text-gray-900 mb-2 lg:mb-0"
        >
          {title} {cartItems}
        </Typography.H1>
        {subTitle && (
          <Typography.H2
            id="page-subTitle"
            size="xs"
            title={subTitle}
            className="text-gray-700 mb-2 lg:mb-0"
          >
            {subTitle}
          </Typography.H2>
        )}
      </div>

      {button}
    </section>
  );
};

export default PageHeader;
