import React, { ReactElement } from 'react';
import s from './style.module.less';

interface Props {
  header?: ReactElement;
  footer?: ReactElement;
}
export const Overlay: React.FC<Props> = ({ header, footer, children }) => {
  return (
    <div className={s.overlay} data-qa="overlay">
      {header && (
        <div className={s.overlayHeader}>
          <span />
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && <div className={s.overlayFooter}>{footer}</div>}
    </div>
  );
};
