import { Typography } from '@boclips-ui/typography';
import React from 'react';
import useFeatureFlags from 'src/hooks/useFeatureFlags';

interface Props {
  captionsOrTranscriptsRequested: boolean;
}
export const AdditionalServicesPricingMessage = ({
  captionsOrTranscriptsRequested,
}: Props) => {
  const { features, isLoading: featuresAreLoading } = useFeatureFlags();

  const showNewCopy = !featuresAreLoading && features.BO_WEB_APP_DEV;

  return showNewCopy ? (
    <div
      className="bg-blue-100 p-4 my-4 rounded"
      data-qa="additional-services-summary"
    >
      <Typography.H1 size="xs" className="mb-2">
        Information regarding your additional services request
      </Typography.H1>
      {captionsOrTranscriptsRequested && (
        <p className="mb-2">
          <Typography.Body>
            Please note that requests for human-generated captions can take
            between 1-3 business days to be provided.
          </Typography.Body>
        </p>
      )}
      <Typography.Body>
        For queries surrounding additional services please contact your Account
        Manager or contact us on{' '}
        <Typography.Link type="inline-blue">
          <a href="mailto:support@boclips.com">support@boclips.com</a>
        </Typography.Link>
      </Typography.Body>
    </div>
  ) : (
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
};
