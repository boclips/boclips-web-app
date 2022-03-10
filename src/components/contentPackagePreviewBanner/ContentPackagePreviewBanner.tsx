import React from 'react';
import { useGetContentPackage } from 'src/hooks/api/contentPackageQuery';

interface Props {
  packageId: string;
}

export const ContentPackagePreviewBanner = ({ packageId }: Props) => {
  const { data: contentPackage } = useGetContentPackage(packageId);

  return contentPackage ? (
    <div>{`You’re now previewing: ${contentPackage.name}`}</div>
  ) : null;
};
