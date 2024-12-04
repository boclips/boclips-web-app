import { useGetUserQuery } from '@src/hooks/api/userQuery';
import LibraryLogoSVG from '@resources/icons/library-logo.svg?react';
import ClassroomLogoSVG from '@resources/icons/classroom-logo.svg?react';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FeatureGate } from '@components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import s from './style.module.less';

const Logo = (): ReactElement => {
  const { data: user } = useGetUserQuery();

  const logoTitle = user?.account?.logoUrl
    ? `${user.account.name} logo - Go to homepage`
    : 'Boclips logo - Go to homepage';

  return (
    <Link to="/" reloadDocument aria-label={logoTitle} className={s.logo}>
      {user?.account?.logoUrl ? (
        <img alt={logoTitle} src={user?.account?.logoUrl} />
      ) : (
        <FeatureGate
          product={Product.CLASSROOM}
          fallback={<LibraryLogoSVG data-qa="library-logo" />}
        >
          <ClassroomLogoSVG data-qa="classroom-logo" />
        </FeatureGate>
      )}
    </Link>
  );
};

export default Logo;
