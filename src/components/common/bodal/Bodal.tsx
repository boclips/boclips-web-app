import React, { PropsWithChildren, ReactElement } from 'react';
import Button from '@boclips-ui/button';
import CloseIconSVG from 'src/resources/icons/cross-icon.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from './style.module.less';

export interface Props {
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonText?: string;
  isLoading?: boolean;
  cancelButtonText?: string;
  dataQa?: string;
}

export const Bodal: React.FC<Props> = ({
  title,
  onConfirm,
  confirmButtonText = 'Confirm',
  isLoading = false,
  onCancel,
  cancelButtonText = 'Cancel',
  dataQa = 'modal',
  children,
}: PropsWithChildren<Props>) => {
  const breakpoints = useMediaBreakPoint();
  const mobileView = breakpoints.type === 'mobile';

  const getSpinner = (): ReactElement =>
    isLoading && (
      <span data-qa="spinner" className="pb-2">
        <LoadingOutlined />
      </span>
    );
  const header = (
    <>
      {mobileView && <span />}
      <span className="text-gray-900 text-xl font-medium" id="bodal-title">
        {title}
      </span>
      <button
        type="button"
        aria-label={`Close ${title} modal`}
        onClick={onCancel}
      >
        <CloseIconSVG className="stroke-current stroke-2" />
      </button>
    </>
  );

  const footer = (
    <>
      <Button onClick={onCancel} text={cancelButtonText} type="outline" />
      <Button
        onClick={onConfirm}
        text={confirmButtonText}
        disabled={isLoading}
        icon={getSpinner()}
      />
    </>
  );

  return (
    <div
      role="dialog"
      aria-labelledby="bodal-title"
      data-qa={dataQa}
      className={s.modalWrapper}
    >
      <div className={s.modal}>
        <div className={s.modalContent}>
          <div className={s.modalHeader}>{header}</div>
          {children}
        </div>
        <div className={s.modalFooter}>{footer}</div>
      </div>
    </div>
  );
};
