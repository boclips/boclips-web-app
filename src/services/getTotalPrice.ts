import { Video } from 'boclips-api-client/dist/types';
import { Price } from 'boclips-api-client/dist/sub-clients/videos/model/Price';

export const getTotalPrice = (videos: Video[]): Price | null => {
  const videosWithPrices = videos?.filter((video) => Boolean(video.price));

  if (!videosWithPrices || videosWithPrices.length < 1) {
    return null;
  }

  const totalPrice = videosWithPrices
    .map((video) => video.price.amount)
    .reduce((accumulator, currentValue) => accumulator + currentValue);

  return {
    amount: totalPrice,
    currency: videosWithPrices[0].price.currency,
  };
};
