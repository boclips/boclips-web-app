import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import { Button, Typography } from 'boclips-ui';
import CloseIconSVG from '@resources/icons/cross-icon.svg?react';
import { LoadingOutlined } from '@ant-design/icons';
import { TextButton } from '@components/common/textButton/TextButton';
import { handleEscapeKeyEvent } from '@src/services/handleKeyEvent';
import FocusTrap from 'focus-trap-react';
import CloseOnClickOutside from '@src/hooks/closeOnClickOutside';
import c from 'classnames';
import s from './style.module.less';

export interface Props {
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonText?: string;
  isLoading?: boolean;
  isConfirmEnabled?: boolean;
  cancelButtonText?: string;
  dataQa?: string;
  initialFocusRef?: React.RefObject<HTMLElement> | string;
  closeOnClickOutside?: boolean;
  children: React.ReactNode;
  confirmButtonIcon?: React.ReactElement;
  displayCancelButton?: boolean;
  smallSize?: boolean;
  showFooter?: boolean;
  showCloseIcon?: boolean;
  footerClass?: string;
  footerText?: ReactElement | string;
  extraButton?: ReactElement;
}

export const Bodal: React.FC<Props> = ({
  title,
  onConfirm,
  confirmButtonText = 'Confirm',
  isLoading = false,
  isConfirmEnabled = true,
  onCancel,
  cancelButtonText = 'Cancel',
  dataQa = 'modal',
  children,
  initialFocusRef,
  closeOnClickOutside = true,
  confirmButtonIcon,
  displayCancelButton = true,
  smallSize = true,
  showFooter = true,
  showCloseIcon = true,
  footerClass,
  footerText,
  extraButton,
}: PropsWithChildren<Props>) => {
  const getSpinner = (): ReactElement =>
    isLoading ? (
      <span data-qa="spinner" className="pb-2">
        <LoadingOutlined />
      </span>
    ) : (
      confirmButtonIcon
    );

  const ref = useRef(null);

  CloseOnClickOutside(ref, closeOnClickOutside ? onCancel : () => {});

  const onKeyDown = (e: KeyboardEvent) => handleEscapeKeyEvent(e, onCancel);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (typeof initialFocusRef === 'string') {
      document.getElementById(initialFocusRef as string)?.focus();
    } else {
      initialFocusRef?.current.focus();
    }
  }, [initialFocusRef]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
      >
        <div id="bodal-description" hidden>
          This is a dialog for {title}. Escape will cancel and close the window.
        </div>
        <div className={c(s.modal, { [s.small]: smallSize })} ref={ref}>
          <div className={s.modalContent}>
            <div className={s.modalHeader}>
              <Typography.H1
                size="sm"
                className="text-gray-900"
                id="bodal-title"
              >
                {title}
              </Typography.H1>
              {showCloseIcon && (
                <button
                  type="button"
                  aria-label={`Close ${title} modal`}
                  onClick={onCancel}
                >
                  <CloseIconSVG className="stroke-current stroke-2" />
                </button>
              )}
            </div>
            {children}
          </div>
          {showFooter && (
            <div
              className={c(
                s.modalFooter,
                displayCancelButton || extraButton
                  ? [s.multiButtonFooter]
                  : [s.oneButtonFooter],
                footerClass,
              )}
            >
              {displayCancelButton && (
                <TextButton onClick={onCancel} text={cancelButtonText} />
              )}
              <Button
                onClick={onConfirm}
                text={confirmButtonText}
                name={confirmButtonText}
                disabled={isLoading || (!isConfirmEnabled && !isLoading)}
                icon={getSpinner()}
              />
              {extraButton}
            </div>
          )}
          {footerText}
        </div>
      </div>
    </FocusTrap>
  );
};
