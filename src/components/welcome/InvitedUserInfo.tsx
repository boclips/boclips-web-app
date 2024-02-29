import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import s from './style.module.less';

const InvitedUserInfo = () => {
  const { data: user } = useGetUserQuery();

  return (
    user && (
      <section id="one" className={s.userInfo}>
        <div className="flex flex-row">
          <Typography.Body className="mr-2">Name:</Typography.Body>
          <Typography.Body weight="medium">
            {user.firstName} {user.lastName}
          </Typography.Body>
        </div>
        <div className="flex flex-row">
          <FeatureGate
            product={Product.CLASSROOM}
            fallback={
              <Typography.Body className="mr-2">Organization:</Typography.Body>
            }
          >
            <Typography.Body className="mr-2">School:</Typography.Body>
          </FeatureGate>
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
