import { Constants } from '@src/AppConstants';
import { useBoclipsSecurity } from '@src/components/common/providers/BoclipsSecurityProvider';
import { Typography } from 'boclips-ui';
import React from 'react';

const LogoutButton = () => {
  const boclipsSecurity = useBoclipsSecurity();

  const logOut = () => {
    boclipsSecurity.logout({
      redirectUri: `${Constants.HOST}/`,
    });
  };

  return (
    <button className="text-xs" type="button" onClick={logOut}>
      <Typography.Link className="!text-red-error">Log out</Typography.Link>
    </button>
  );
};

export default LogoutButton;
