import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  captionsRequested?: boolean;
  transcriptRequested?: boolean;
  trim?: string;
  editRequest?: string;
  fontSize?: 'small';
  displayPrice?: boolean;
}

export const AdditionalServicesSummaryPreview = ({
  captionsRequested,
  transcriptRequested,
  trim,
  editRequest,
  displayPrice = false,
  fontSize,
}: Props) => {
  const noAdditionalServices =
    !captionsRequested && !transcriptRequested && !editRequest && !trim;

  const getHeaderCopy = () => {
    return noAdditionalServices
      ? 'No additional services selected'
      : 'Additional Services';
  };

  const Price = React.useCallback(() => {
    return (
      <Typography.Body as="div" size="small" className="absolute right-0 top-0">
        Free
      </Typography.Body>
    );
  }, []);

  return (
    <Typography.Body
      as="div"
      size={fontSize}
      data-qa="order-summary-item-additional-services"
      className={`flex flex-col text-gray-800 w-full ${s.additionalServices}`}
    >
      <Typography.Body size="small" weight="medium">
        {getHeaderCopy()}
      </Typography.Body>
      {captionsRequested && (
        <Typography.Body
          size="small"
          className="relative"
          data-qa="order-summary-item-captions-requested"
        >
          English captions requested {displayPrice && <Price />}
        </Typography.Body>
      )}

      {transcriptRequested && (
        <Typography.Body
          size="small"
          className="relative"
          data-qa="order-summary-item-transcripts-requested"
        >
          Transcripts requested {displayPrice && <Price />}
        </Typography.Body>
      )}

      {trim && (
        <Typography.Body
          size="small"
          className="relative"
          data-qa="order-summary-item-trim"
        >
          Trim: {trim} {displayPrice && <Price />}
        </Typography.Body>
      )}

      {editRequest && (
        <Typography.Body
          size="small"
          className="relative"
          data-qa="order-summary-item-editing"
        >
          Other type of editing: {editRequest} {displayPrice && <Price />}
        </Typography.Body>
      )}
    </Typography.Body>
  );
};
