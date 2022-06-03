import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Link } from '../Link';
import s from './style.module.less';

interface Props {
  name: string;
  link: string;
  header: React.ReactElement;
  subheader?: React.ReactElement;
  footer?: React.ReactElement;
  overlay?: React.ReactElement;
  price?: React.ReactElement;
}

const GridCard = ({
  name,
  link,
  header,
  footer,
  overlay,
  price,
  subheader,
}: Props) => {
  return (
    <div className={s.gridCard} data-qa={`grid-card-for-${name}`}>
      {overlay}
      {header}
      <div className={s.price}>{price}</div>
      <div className={s.header}>
        <Link
          to={{
            pathname: link,
            state: { name },
          }}
          aria-label={`${name} grid card`}
        >
          <Typography.Title2>{name}</Typography.Title2>
        </Link>
      </div>
      <div>{subheader}</div>
      {footer}
    </div>
  );
};

export default GridCard;
