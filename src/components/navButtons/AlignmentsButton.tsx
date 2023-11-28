import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import c from 'classnames';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { FeatureGate } from 'src/components/common/FeatureGate';
import s from './style.module.less';
import AlignmentsIcon from '../../resources/icons/alignments.svg';

const AlignmentsButton = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const isOnSparksPage = location.pathname.includes('sparks');
  const { features } = useFeatureFlags();

  const onClick = () => {
    let pathname = '/sparks';
    const isEnabled = features.ALIGNMENTS_RENAMING;
    if (isEnabled) {
      pathname = '/alignments';
    }
    navigate({
      pathname,
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
        <FeatureGate
          feature="ALIGNMENTS_RENAMING"
          fallback={<span>Sparks</span>}
        >
          <span>Alignments</span>
        </FeatureGate>
      </button>
    </div>
  );
};

export default AlignmentsButton;
