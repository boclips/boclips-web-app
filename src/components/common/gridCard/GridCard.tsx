import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useShareCodeReferer } from 'src/components/common/providers/ShareCodeContextProvider';
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
  const location = useLocation();
  const shareCodeReferer = useShareCodeReferer();
  const search = shareCodeReferer ? `referer=${shareCodeReferer.referer}` : '';
  return (
    <div className={s.gridCard} data-qa={`grid-card-for-${name}`}>
      {overlay}
      {header}
      {playerBadge && <div className={s.playerBadge}>{playerBadge}</div>}
      <div className={s.header}>
        <Link
          to={{
            pathname: link,
            search,
          }}
          state={{
            name,
            userNavigated: true,
            originPathname: location.pathname,
            shareCodeReferer,
          }}
          onClick={onLinkClicked}
          aria-label={`${name} grid card`}
        >
          <Typography.Title2>{name}</Typography.Title2>
        </Link>
      </div>
      {subheader}
      {footer}
    </div>
  );
};

export default GridCard;
