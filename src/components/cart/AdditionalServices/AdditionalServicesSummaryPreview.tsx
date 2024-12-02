import React from 'react';
import { Typography } from 'boclips-ui';
import s from './style.module.less';

interface Props {
  captionsAndTranscriptsRequested?: boolean;
  trim?: string;
  editRequest?: string;
  fontSize?: 'small';
}

export const AdditionalServicesSummaryPreview = ({
  captionsAndTranscriptsRequested,
  trim,
  editRequest,
  fontSize,
}: Props) => {
  const noAdditionalServices =
    !captionsAndTranscriptsRequested && !editRequest && !trim;

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

      {captionsAndTranscriptsRequested && (
        <span
          className={s.additionalItem}
          data-qa="order-summary-item-captions-transcripts-requested"
        >
          English captions and transcripts requested
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
