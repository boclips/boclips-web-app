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
  playerBadge?: React.ReactElement;
  onLinkClicked?: () => void;
}

const GridCard = ({
  name,
  link,
  header,
  footer,
  overlay,
  playerBadge,
  subheader,
  onLinkClicked,
}: Props) => {
  return (
    <div className={s.gridCard} data-qa={`grid-card-for-${name}`}>
      {overlay}
      {header}
      <div className={s.playerBadge}>{playerBadge}</div>
      <div className={s.header}>
        <Link
          to={{
            pathname: link,
            state: { name },
          }}
          onClick={onLinkClicked}
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
