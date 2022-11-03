import React from 'react';
import c from 'classnames';
import s from './SlidingDrawer.module.less';

interface Props {
  isOpen: boolean;
  children: React.ReactNode;
}

const SlidingDrawer = ({ isOpen, children }: Props) => {
  return (
    <div className={isOpen ? c(s.slidingDrawer, s.open) : c(s.slidingDrawer)}>
      {children}
    </div>
  );
};

export default SlidingDrawer;
