import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  captionsRequested?: boolean;
  transcriptRequested?: boolean;
  trim?: string;
  editRequest?: string;
  fontSize?: 'small';
}

export const AdditionalServicesSummaryPreview = ({
  captionsRequested,
  transcriptRequested,
  trim,
  editRequest,
  fontSize,
}: Props) => {
  const noAdditionalServices =
    !captionsRequested && !transcriptRequested && !editRequest && !trim;

  const getHeaderCopy = () => {
    return noAdditionalServices
      ? 'No additional services selected'
      : 'Additional Services:';
  };

  return (
    <Typography.Body
      as="div"
      size={fontSize}
      data-qa="order-summary-item-additional-services"
      className="flex flex-col text-gray-900 w-full"
    >
      <Typography.Body size={fontSize} weight="medium">
        {getHeaderCopy()}
      </Typography.Body>
      {captionsRequested && (
        <span
          className={s.additionalItem}
          data-qa="order-summary-item-captions-requested"
        >
          English captions requested
        </span>
      )}

      {transcriptRequested && (
        <span
          className={s.additionalItem}
          data-qa="order-summary-item-transcripts-requested"
        >
          Transcripts requested
        </span>
      )}

      {trim && (
        <span className={s.additionalItem} data-qa="order-summary-item-trim">
          Trim: {trim}
        </span>
      )}

      {editRequest && (
        <span className={s.additionalItem} data-qa="order-summary-item-editing">
          Other type of editing: {editRequest}
        </span>
      )}
    </Typography.Body>
  );
};
