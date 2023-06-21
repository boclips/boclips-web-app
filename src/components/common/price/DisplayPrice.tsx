import React, { useMemo } from 'react';
import { Typography } from '@boclips-ui/typography';
import { Price } from 'boclips-api-client/dist/sub-clients/videos/model/Price';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import CreditsSVG from 'src/resources/icons/credits.svg';

interface Props {
  price: Price;
}

const DisplayPrice = ({ price }: Props) => {
  const isCredits = price.currency === 'CREDITS';
  const calculatedPrice = useMemo(
    () =>
      createPriceDisplayValue(price.amount, price.currency, getBrowserLocale()),
    [price],
  );

  return (
    <Typography.Title1 className="flex items-center" data-qa="price-badge">
      {isCredits ? (
        <>
          <CreditsSVG />
          <span data-qa="credit-price" className="ml-1">
            {calculatedPrice}
          </span>
        </>
      ) : (
        <>{calculatedPrice}</>
      )}
    </Typography.Title1>
  );
};

export default DisplayPrice;
