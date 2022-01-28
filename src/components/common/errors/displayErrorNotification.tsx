import React from 'react';
import { notification } from 'antd';
import CloseIcon from '../../../resources/icons/cross-icon.svg';
import './displayErrorNotification.less';

export const displayErrorNotification = (
  key: string,
  title: string,
  message: string,
) => {
  notification.close(key);
  notification.open({
    message: <span className="font-medium bg-red-800">{title}</span>,
    description: <span className="font-normal">{message}</span>,
    key,
    closeIcon: (
      <div className="close-icon-wrapper">
        <CloseIcon />
      </div>
    ),
    placement: 'bottomRight',
    duration: 10,
    className: 'error-notification border-l-8',
  });
};
