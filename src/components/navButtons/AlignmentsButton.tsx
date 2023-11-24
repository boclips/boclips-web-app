import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import c from 'classnames';
import s from './style.module.less';
import AlignmentsIcon from '../../resources/icons/alignments.svg';

const AlignmentsButton = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const isOnSparksPage = location.pathname.includes('sparks');

  const onClick = () => {
    navigate({
      pathname: '/sparks',
    });
  };

  return (
    <div
      className={c(s.navButton, {
        [s.active]: isOnSparksPage,
      })}
    >
      <button type="button" onClick={onClick} className={s.headerButton}>
        <AlignmentsIcon className={s.navbarIcon} />
        <span>Sparks</span>
      </button>
    </div>
  );
};

export default AlignmentsButton;
