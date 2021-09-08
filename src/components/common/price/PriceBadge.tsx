import { Price } from 'boclips-api-client/dist/sub-clients/videos/model/Price';
import React from 'react';
import { PriceUnavailableBadge } from 'src/components/common/price/priceUnavailableBadge/PriceUnavailableBadge';
import { Constants } from 'src/AppConstants';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import c from 'classnames';

interface Props {
  price?: Price;
  className?: string;
}

export const PriceBadge = ({ price, className }: Props) => {
  const { data: user } = useGetUserQuery();

  const userIsPearson =
    user?.organisation?.id === Constants.PEARSON_ORGANISATION_ID;

  const shouldShowPriceUnavailableBadge =
    userIsPearson && (!price || price.amount === 0);

  return shouldShowPriceUnavailableBadge ? (
    <PriceUnavailableBadge />
  ) : (
    <span className={c(className, 'font-bold text-xl')} data-qa="price-badge">
      {createPriceDisplayValue(
        price?.amount,
        price?.currency,
        getBrowserLocale(),
      )}
    </span>
  );
};
