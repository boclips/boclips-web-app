import React from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SlidingDrawer = (props: Props) => {
  return (
    <div
      className={props.isOpen ? c(s.slidingDrawer, s.open) : c(s.slidingDrawer)}
    >
      <button type="button" onClick={props.onClose}>
        Close
      </button>
      <span>Hello, World!</span>
    </div>
  );
};

export default SlidingDrawer;
