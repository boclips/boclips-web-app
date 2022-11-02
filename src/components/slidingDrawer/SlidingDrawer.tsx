import React from 'react';
import c from 'classnames';
import s from './SlidingDrawer.module.less';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlidingDrawer = (props: Props) => {
  return (
    <div
      className={props.isOpen ? c(s.slidingDrawer, s.open) : c(s.slidingDrawer)}
    >
      <button type="button" onClick={props.onClose}>
        Close
      </button>
      {props.children}
    </div>
  );
};

export default SlidingDrawer;
