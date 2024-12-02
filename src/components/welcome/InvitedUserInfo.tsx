import React from 'react';
import { Typography } from 'boclips-ui';
import { useGetUserQuery } from '@src/hooks/api/userQuery';
import { FeatureGate } from '@src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import s from './style.module.less';

const UserInfoItem = ({
  label,
  value,
}: {
  label: string | React.ReactNode;
  value: string;
}) => (
  <div className="grid grid-cols-6">
    <Typography.Body className="mr-4 col-span-1">{label}</Typography.Body>
    <Typography.Body weight="medium" className="ml-8 col-span-5">
      {value}
    </Typography.Body>
  </div>
);

const InvitedUserInfo = () => {
  const { data: user } = useGetUserQuery();

  return (
    user && (
      <section id="one" className={s.userInfo}>
        <UserInfoItem
          label="Name:"
          value={`${user.firstName} ${user.lastName}`}
        />
        <UserInfoItem
          label={
            <FeatureGate
              product={Product.CLASSROOM}
              fallback={<span>Organization:</span>}
            >
              <span>School:</span>
            </FeatureGate>
          }
          value={user.account?.name}
        />
        <UserInfoItem label="Email:" value={user.email} />
      </section>
    )
  );
};

export default InvitedUserInfo;
