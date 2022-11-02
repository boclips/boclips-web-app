import React from 'react';
import c from 'classnames';
import s from './SlidingDrawer.module.less';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlidingDrawer = ({ isOpen, onClose, children }: Props) => {
  return (
    <div className={isOpen ? c(s.slidingDrawer, s.open) : c(s.slidingDrawer)}>
      <button type="button" onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  );
};

export default SlidingDrawer;
