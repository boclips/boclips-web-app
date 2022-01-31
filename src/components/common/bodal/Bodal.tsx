import React, { PropsWithChildren } from 'react';
import c from 'classnames';
import Button from '@boclips-ui/button';
import CloseIconSVG from 'src/resources/icons/cross-icon.svg';
import s from './style.module.less';

export interface Props {
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonText?: string;
  confirmDisabled?: boolean;
  cancelButtonText?: string;
  dataQa?: string;
}

export const Bodal: React.FC<Props> = ({
  title,
  onConfirm,
  confirmButtonText = 'Confirm',
  confirmDisabled = false,
  onCancel,
  cancelButtonText = 'Cancel',
  dataQa = 'modal',
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div
      role="dialog"
      aria-labelledby="bodal-title"
      data-qa={dataQa}
      className={c(s.modalWrapper, { [s.showModal]: true })} // TODO
    >
      <div className={s.modal}>
        <div className={s.modalContent}>
          <div className={s.modalHeader}>
            <span
              className="text-gray-900 text-xl font-medium"
              id="bodal-title"
            >
              {title}
            </span>
            <button
              type="button"
              aria-label={`Close ${title} modal`}
              onClick={onCancel}
            >
              <CloseIconSVG className="stroke-current stroke-2" />
            </button>
          </div>
          {children}
          <div className={s.buttons}>
            <Button onClick={onCancel} text={cancelButtonText} type="outline" />
            <Button
              onClick={onConfirm}
              text={confirmButtonText}
              disabled={confirmDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
