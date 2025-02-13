import { useGetUserQuery } from 'src/hooks/api/userQuery';
import s from 'src/components/assistant/chatArea/style.module.less';
import React from 'react';

export const UserIcon = () => {
  const { data: user } = useGetUserQuery();

  const userInitials = !user
    ? 'Y'
    : `${user?.firstName[0]}${user?.lastName[0]}`;

  return <div className={s.messengerIcon}>{userInitials}</div>;
};
