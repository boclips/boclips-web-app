import React from 'react';
import { useGetContentPackage } from '@src/hooks/api/contentPackageQuery';

interface Props {
  packageId: string;
}

export const ContentPackagePreviewBanner = ({ packageId }: Props) => {
  const { data: contentPackage } = useGetContentPackage(packageId);

  return (
    <div
      className="w-full mx-auto fixed bottom-0 py-6 bg-yellow-warning z-20 flex justify-center border-2 border-yellow-warning-border border-solid border-x-0 border-b-0"
      role="banner"
    >
      <span className="text-base">
        You’re now previewing:{' '}
        <span className="font-bold">{contentPackage?.name || '...'}</span>
      </span>
    </div>
  );
};
