import { Constants } from 'src/AppConstants';
import { useBoclipsSecurity } from 'src/components/common/providers/BoclipsSecurityProvider';
import { Typography } from '@boclips-ui/typography';
import React from 'react';

const LogoutButton = () => {
  const boclipsSecurity = useBoclipsSecurity();

  const logOut = () => {
    boclipsSecurity.logout({
      redirectUri: `${Constants.HOST}/`,
    });
  };

  return (
    <button type="button" onClick={logOut}>
      <Typography.Link>Log out</Typography.Link>
    </button>
  );
};

export default LogoutButton;
