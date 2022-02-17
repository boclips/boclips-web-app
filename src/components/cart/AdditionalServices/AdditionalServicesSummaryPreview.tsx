import React from 'react';
import s from './style.module.less';

interface Props {
  captionsRequested?: boolean;
  transcriptRequested?: boolean;
  trim?: string;
  editRequest?: string;
  fontSize?: 'text-base' | 'text-xs';
  displayPrice?: boolean;
}

export const AdditionalServicesSummaryPreview = ({
  captionsRequested,
  transcriptRequested,
  trim,
  editRequest,
  displayPrice = false,
  fontSize = 'text-base',
}: Props) => {
  const noAdditionalServices =
    !captionsRequested && !transcriptRequested && !editRequest && !trim;

  const getHeaderCopy = () => {
    return noAdditionalServices
      ? 'No additional services selected'
      : 'Additional Services';
  };

  const Price = React.useCallback(() => {
    return <div className="absolute right-0 top-0">Free</div>;
  }, []);

  return (
    <div
      data-qa="order-summary-item-additional-services"
      className={`flex flex-col text-gray-800 w-full ${fontSize} ${s.additionalServices}`}
    >
      <span className="font-medium">{getHeaderCopy()}</span>

      {captionsRequested && (
        <span
          className="relative"
          data-qa="order-summary-item-captions-requested"
        >
          English captions requested {displayPrice && <Price />}
        </span>
      )}

      {transcriptRequested && (
        <span
          className="relative"
          data-qa="order-summary-item-transcripts-requested"
        >
          Transcripts requested {displayPrice && <Price />}
        </span>
      )}

      {trim && (
        <span className="relative" data-qa="order-summary-item-trim">
          Trim: {trim} {displayPrice && <Price />}
        </span>
      )}

      {editRequest && (
        <span className="relative" data-qa="order-summary-item-editing">
          Other type of editing: {editRequest} {displayPrice && <Price />}
        </span>
      )}
    </div>
  );
};
