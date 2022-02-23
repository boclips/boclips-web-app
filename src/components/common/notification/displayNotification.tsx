import React from 'react';
import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import c from 'classnames';
import s from './displayNotification.module.less';

export const displayNotification = (
  type: 'error' | 'success',
  title: string,
  message?: string,
  dataQa?: string,
) => {
  const toastBody = (
    <div data-qa={dataQa} className={s.body}>
      <div className={s.title}>{title}</div>
      {message && <div className={s.message}>{message}</div>}
    </div>
  );

  // set autoclose depending on message length
  const msgLength = message ? message.length : 0;
  const autoClose = Math.min(Math.max(msgLength * 50, 2000), 7000);

  const options: ToastOptions = {
    position: 'top-right',
    autoClose,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    icon: false,
    theme: undefined,
  };

  if (type === 'error') {
    toast.error(toastBody, { ...options, className: c(s.toastError, s.toast) });
  }

  if (type === 'success') {
    toast.success(toastBody, {
      ...options,
      className: c(s.toastSuccess, s.toast),
    });
  }
};
