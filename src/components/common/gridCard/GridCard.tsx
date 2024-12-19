import { Typography } from 'boclips-ui';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '../Link';
import s from './style.module.less';

interface Props {
  name: string;
  link?: string;
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
  const location = useLocation();
  return (
    <div className={s.gridCard} data-qa={`grid-card-for-${name}`}>
      {overlay}
      {header}
      {playerBadge && <div className={s.playerBadge}>{playerBadge}</div>}
      <div className={s.header}>
        {link ? (
          <Link
            to={{
              pathname: link,
            }}
            state={{
              name,
              userNavigated: true,
              originPathname: location.pathname,
            }}
            onClick={onLinkClicked}
            aria-label={`${name} grid card`}
          >
            <Typography.Title2>{name}</Typography.Title2>
          </Link>
        ) : (
          <Typography.Title2>{name}</Typography.Title2>
        )}
      </div>
      {subheader}
      {footer}
    </div>
  );
};

export default GridCard;
