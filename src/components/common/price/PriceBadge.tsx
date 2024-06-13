import { Price } from 'boclips-api-client/dist/sub-clients/videos/model/Price';
import React from 'react';
import { PriceUnavailableBadge } from 'src/components/common/price/priceUnavailableBadge/PriceUnavailableBadge';
import { Constants } from 'src/AppConstants';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import DisplayPrice from 'src/components/common/price/DisplayPrice';

interface Props {
  price: Price;
}

export const PriceBadge = ({ price }: Props) => {
  const { data: user } = useGetUserQuery();

  const userIsPearson = user?.account?.id === Constants.PEARSON_ACCOUNT_ID;

  const shouldShowPriceUnavailableBadge =
    userIsPearson && (!price || price.amount === 0);

  return shouldShowPriceUnavailableBadge ? (
    <PriceUnavailableBadge />
  ) : (
    price && <DisplayPrice price={price} />
  );
};
