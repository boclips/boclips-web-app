import React, { useMemo } from 'react';
import { Typography } from '@boclips-ui/typography';
import { Price } from 'boclips-api-client/dist/sub-clients/videos/model/Price';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import CreditsSVG from 'src/resources/icons/credits.svg';
import c from 'classnames';

interface Props {
  price: Price;
  isBold?: boolean;
}

const DisplayPrice = ({ price, isBold = true }: Props) => {
  const isCredits = price.currency === 'CREDITS';
  const calculatedPrice = useMemo(
    () =>
      createPriceDisplayValue(price.amount, price.currency, getBrowserLocale()),
    [price],
  );

  return (
    <Typography.Body
      className={c('flex items-center text-gray-900', {
        '!font-bold !text-lg': isBold,
      })}
      data-qa="price-badge"
    >
      {isCredits ? (
        <>
          <CreditsSVG />
          <span data-qa="credit-price" className="mt-0.5 ml-1">
            {calculatedPrice}
          </span>
        </>
      ) : (
        <>{calculatedPrice}</>
      )}
    </Typography.Body>
  );
};

export default DisplayPrice;
