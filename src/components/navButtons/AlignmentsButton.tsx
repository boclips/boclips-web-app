import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import c from 'classnames';
import AlignmentsIcon from '@resources/icons/alignments.svg?react';
import s from './style.module.less';

const AlignmentsButton = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const isOnAlignmentsPage = location.pathname.includes('alignments');

  const onClick = () => {
    navigate('/alignments');
  };

  return (
    <div
      className={c(s.navButton, {
        [s.active]: isOnAlignmentsPage,
      })}
    >
      <button type="button" onClick={onClick} className={s.headerButton}>
        <AlignmentsIcon className={s.navbarIcon} />
        <span>Alignments</span>
      </button>
    </div>
  );
};

export default AlignmentsButton;
