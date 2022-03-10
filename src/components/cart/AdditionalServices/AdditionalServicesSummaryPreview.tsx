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
      : 'Additional Services:';
  };

  const Price = React.useCallback(() => {
    return <Typography.Body>Free</Typography.Body>;
  }, []);

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
          English captions requested {displayPrice && <Price />}
        </span>
      )}

      {transcriptRequested && (
        <span
          className={s.additionalItem}
          data-qa="order-summary-item-transcripts-requested"
        >
          Transcripts requested {displayPrice && <Price />}
        </span>
      )}

      {trim && (
        <span className={s.additionalItem} data-qa="order-summary-item-trim">
          Trim: {trim} {displayPrice && <Price />}
        </span>
      )}

      {editRequest && (
        <span className={s.additionalItem} data-qa="order-summary-item-editing">
          Other type of editing: {editRequest} {displayPrice && <Price />}
        </span>
      )}
    </Typography.Body>
  );
};
