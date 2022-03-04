import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import Button from '@boclips-ui/button';
import CloseIconSVG from 'src/resources/icons/cross-icon.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { TextButton } from 'src/components/common/textButton/TextButton';
import { handleEscapeKeyEvent } from 'src/services/handleKeyEvent';
import FocusTrap from 'focus-trap-react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

export interface Props {
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonText?: string;
  isLoading?: boolean;
  cancelButtonText?: string;
  dataQa?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
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
  initialFocusRef,
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
      <Typography.H4 className="text-gray-900" id="bodal-title">
        {title}
      </Typography.H4>
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
      <TextButton onClick={onCancel} text={cancelButtonText} />
      <Button
        onClick={onConfirm}
        text={confirmButtonText}
        disabled={isLoading}
        icon={getSpinner()}
      />
    </>
  );

  useEffect(() => {
    initialFocusRef?.current.focus();
  }, [initialFocusRef]);

  return (
    <FocusTrap>
      {/* Below should be fine according to https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/479 */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        role="dialog"
        aria-labelledby="bodal-title"
        data-qa={dataQa}
        className={s.modalWrapper}
        aria-describedby="bodal-description"
        onKeyDown={(event) => handleEscapeKeyEvent(event, onCancel)}
      >
        <div id="bodal-description" hidden>
          This is a dialog for {title}. Escape will cancel and close the window.
        </div>
        <div className={s.modal}>
          <div className={s.modalContent}>
            <div className={s.modalHeader}>{header}</div>
            {children}
          </div>
          <div className={s.modalFooter}>{footer}</div>
        </div>
      </div>
    </FocusTrap>
  );
};
