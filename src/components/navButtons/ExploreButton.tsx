import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import c from 'classnames';
import s from './style.module.less';
import ExploreIcon from '../../resources/icons/explore.svg';

const ExploreButton = () => {
  const history = useHistory();

  const location = useLocation();
  const isOnExplorePage = location.pathname.includes('explore/openstax');

  const onClick = () => {
    history.push({
      pathname: '/explore/openstax',
    });
  };

  return (
    <div
      className={c(s.navButton, {
        [s.active]: isOnExplorePage,
      })}
    >
      <button type="button" onClick={onClick} className={s.headerButton}>
        <ExploreIcon className={s.navbarIcon} />
        <span>Explore</span>
        <span className="sr-only"> openstax books</span>
      </button>
    </div>
  );
};

export default ExploreButton;
