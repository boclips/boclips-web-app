import React from 'react';
import { useGetContentPackage } from 'src/hooks/api/contentPackageQuery';

interface Props {
  packageId: string;
}

export const ContentPackagePreviewBanner = ({ packageId }: Props) => {
  const { data: contentPackage } = useGetContentPackage(packageId);

  return (
    <div
      className="w-full mx-auto fixed bottom-0 py-6 bg-yellow-warning z-20 flex justify-center border-t-2 border-yellow-warning-border border-solid"
      role="banner"
    >
      <span className="text-base">
        You’re now previewing:{' '}
        <span className="font-bold">{contentPackage?.name || '...'}</span>
      </span>
    </div>
  );
};
