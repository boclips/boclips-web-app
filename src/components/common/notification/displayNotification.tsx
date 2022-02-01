import React from 'react';
import { notification } from 'antd';
import CloseIcon from '../../../resources/icons/cross-icon.svg';
import './displayNotification.less';

export const displayNotification = (
  type: 'error' | 'success',
  key: string,
  title: string,
  message?: string,
) => {
  const className =
    type === 'success' ? 'success-notification' : 'error-notification';
  const duration = type === 'success' ? 3 : 10;

  notification.close(key);
  notification.open({
    message: <span className="font-medium">{title}</span>,
    description: message ? (
      <span className="font-normal">{message}</span>
    ) : null,
    key,
    closeIcon: (
      <div className="close-icon-wrapper">
        <CloseIcon />
      </div>
    ),
    placement: 'bottomRight',
    duration,
    className,
  });
};
