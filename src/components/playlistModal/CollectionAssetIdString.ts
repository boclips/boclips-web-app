import { CollectionAssetId } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';

export const assetIdString = (assetId: CollectionAssetId): string => {
  if (assetId.highlightId) {
    return `${assetId.videoId}_${assetId.highlightId}`;
  }

  return assetId.videoId;
};
