import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import s from './style.module.less';

const InvitedUserInfo = () => {
  const { data: user } = useGetUserQuery();

  return (
    user && (
      <section className={s.userInfo}>
        <div className="flex flex-row">
          <Typography.Body className="mr-2">Name:</Typography.Body>
          <Typography.Body weight="medium">
            {user.firstName} {user.lastName}
          </Typography.Body>
        </div>
        <div className="flex flex-row">
          <Typography.Body className="mr-2">Organisation:</Typography.Body>
          <Typography.Body weight="medium">
            {user.account?.name}
          </Typography.Body>
        </div>
        <div className="flex flex-row">
          <Typography.Body className="mr-2">Email:</Typography.Body>
          <Typography.Body weight="medium">{user.email}</Typography.Body>
        </div>
      </section>
    )
  );
};

export default InvitedUserInfo;
