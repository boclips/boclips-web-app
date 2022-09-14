import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';

interface OpenstaxCardButtonsProps {
  video: Video;
}

export const OpenstaxVideoCardButtons = ({
  video,
}: OpenstaxCardButtonsProps) => {
  const showEmbedButton = video.links.createEmbedCode;
  const primaryButton = showEmbedButton ? (
    <EmbedButton video={video} />
  ) : (
    <FeatureGate linkName="cart">
      <AddToCartButton video={video} key="cart-button" width="148px" iconOnly />
    </FeatureGate>
  );

  return <VideoCardButtons primaryButton={primaryButton} video={video} />;
};
