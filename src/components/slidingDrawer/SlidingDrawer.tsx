import React, { useEffect } from 'react';
import c from 'classnames';
import s from './SlidingDrawer.module.less';

interface Props {
  isOpen: boolean;
  onClose: any;
  children: React.ReactNode;
}

const SlidingDrawer = ({ isOpen, children }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className={isOpen ? c(s.slidingDrawer, s.open) : c(s.slidingDrawer)}>
      {children}
    </div>
  );
};

export default SlidingDrawer;
