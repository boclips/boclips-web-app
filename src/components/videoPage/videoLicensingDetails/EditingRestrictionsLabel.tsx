import React, { ReactElement } from 'react';
import { Typography } from 'boclips-ui';

interface Props {
  permission: string;
}
export const EditingRestrictionsLabel = ({
  permission,
}: Props): string | ReactElement => {
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

  const editingFormLink = (
    <a rel="noopener noreferrer" href="https://wkf.ms/3PUYqhP" target="_blank">
      <Typography.Body size="small">
        <Typography.Link type="inline-blue">here</Typography.Link>
      </Typography.Body>
    </a>
  );

  switch (permission) {
    case 'ALLOWED_WITH_RESTRICTIONS':
      return (
        <>
          <p>Additional restrictions apply as well as {editingPolicyLink}</p>
          <p className="my-2">Submit an editing request {editingFormLink}.</p>
        </>
      );
    case 'NOT_ALLOWED':
      return 'Full Restrictions in place. No editing allowed';
    case 'ALLOWED':
      return <>Follow {editingPolicyLink} </>;
    default:
      throw Error(`Editing permission ${permission} not supported`);
  }
};
