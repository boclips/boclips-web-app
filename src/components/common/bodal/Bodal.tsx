import React, { PropsWithChildren, ReactElement } from 'react';
import c from 'classnames';
import Button from '@boclips-ui/button';
import CloseIconSVG from 'src/resources/icons/cross-icon.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { Overlay } from 'src/components/common/overlay/Overlay';
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
  const getSpinner = (): ReactElement =>
    isLoading && (
      <span data-qa="spinner" className="pb-2">
        <LoadingOutlined />
      </span>
    );
  const header = (
    <>
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
  const breakpoints = useMediaBreakPoint();
  const mobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';

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
  return mobileView ? (
    <Overlay header={header} footer={footer}>
      {children}
    </Overlay>
  ) : (
    <div
      role="dialog"
      aria-labelledby="bodal-title"
      data-qa={dataQa}
      className={c(s.modalWrapper, { [s.showModal]: true })} // TODO
    >
      <div className={s.modal}>
        <div className={s.modalContent}>
          <div className={s.modalHeader}>{header}</div>
          {children}
          <div className={s.buttons}>{footer}</div>
        </div>
      </div>
    </div>
  );
};
