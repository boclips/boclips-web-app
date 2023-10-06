import React, { ReactElement } from 'react';
import { Typography } from '@boclips-ui/typography';

const editingPolicyLink = (
  <a
    rel="noopener noreferrer"
    href="https://www.boclips.com/editing-policy"
    target="_blank"
  >
    <Typography.Body size="small">
      <Typography.Link type="inline-blue">
        standard editing policy
      </Typography.Link>
    </Typography.Body>
  </a>
);

export const getEditingRestrictionsLabel = (
  permission: string,
): string | ReactElement => {
  switch (permission) {
    case 'ALLOWED_WITH_RESTRICTIONS':
      return <>Additional restrictions apply as well as {editingPolicyLink}</>;
    case 'NOT_ALLOWED':
      return 'Full Restrictions in place. No editing allowed';
    case 'ALLOWED':
      return <>Follow {editingPolicyLink}</>;
    default:
      throw Error(`Editing permission ${permission} not supported`);
  }
};
