import React from 'react';
import { VideoCarousel } from 'src/components/carousel/VideoCarousel';
import { useGetVideos } from 'src/hooks/api/videoQuery';

export const FeaturedVideos = () => {
  const featuredVideoIds = [
    '5e145c0ebc67ab520cac9e91',
    '5c54d813d8eafeecae2114da',
    '5c54d80bd8eafeecae210fc7',
    '5d3055dde69e6810ae1141b3',
    '5c54d7b5d8eafeecae20e1a9',
    '5eeb5d12e18c7d5971253585',
    '5c54da74d8eafeecae22613f',
    '5e2726bbe78e114607caf371',
    '5eecb63353dd5552df7fb7ad',
    '5fec58c8a9043912467a0b8e',
    '627b42963f890d2245611a22',
    '63020b21d390ea774f8039d7',
    '5eecb5112041e37f2645a4f6',
    '6370f0124320c953bad79e60',
    '5f16b141e1b0492a380807aa',
    '61b22630c0410133751cc90e',
    '5c54da67d8eafeecae225aa7',
    '62bacd271c53ba2c2d0b5d62',
    '5c54da48d8eafeecae22496a',
    '5c54d5c7d8eafeecae1fe3b9',
  ];
  const { data: videos, isLoading } = useGetVideos(featuredVideoIds);

  return (
    !isLoading && <VideoCarousel videos={videos} title="Featured Videos" />
  );
};
