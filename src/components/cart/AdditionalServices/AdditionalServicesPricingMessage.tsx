import { Typography } from '@boclips-ui/typography';
import React from 'react';

export const AdditionalServicesPricingMessage = () => (
  <div
    className="bg-blue-100 p-4 mb-4 rounded"
    data-qa="additional-services-summary"
  >
    <Typography.Body>
      Please contact your Account Manager or{' '}
      <Typography.Link type="inline-blue">
        <a href="mailto:support@boclips.com">support@boclips.com</a>
      </Typography.Link>{' '}
      for details on potential fees for additional services.
    </Typography.Body>
  </div>
);
