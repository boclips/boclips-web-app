import s from 'src/components/playlists/style.module.less';
import React, { useEffect, useState } from 'react';
import { Content } from '@radix-ui/react-tabs';
import LicensesArea from 'src/components/licensesArea/LicensesArea';
import { Hero as ContentEmptyPlaceholderState } from 'src/components/hero/Hero';
import EmptyContentSVG from 'src/resources/icons/empty-content.svg';
import { UseQueryResult } from '@tanstack/react-query';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import {
  useAccountBulkGetUsers,
  useGetUserQuery,
} from 'src/hooks/api/userQuery';
import { LicenseTabType } from 'src/views/licenses/LicensesView';

const PAGE_SIZE = 10;

interface Props {
  value: string;
  getLicenses: (
    page: number,
    pageSize: number,
  ) => UseQueryResult<Pageable<LicensedContent>, unknown>;
  currentPage: number;
  setPage: (number) => void;
  type: LicenseTabType;
}

export const LicensesTab = ({
  value,
  getLicenses,
  currentPage,
  setPage,
  type,
}: Props) => {
  const [userIds, setUserIds] = useState<string[]>([]);
  const { data: currentUser } = useGetUserQuery();
  const { data: userProfiles } = useAccountBulkGetUsers(
    currentUser?.account?.id,
    userIds,
  );

  const { data: licensedContent, isLoading } = getLicenses(
    currentPage,
    PAGE_SIZE,
  );

  useEffect(() => {
    if (!licensedContent) return;

    setUserIds(
      licensedContent.page.map((content) => {
        return content.license.userId;
      }) || [],
    );
  }, [licensedContent]);

  const hasLicensedContent = licensedContent?.page?.length > 0;

  return (
    <Content value={value} className={s.tabContent}>
      {hasLicensedContent || isLoading ? (
        <LicensesArea
          licensedContentPage={licensedContent}
          userProfiles={userProfiles}
          onPageChange={(newPage) => setPage(newPage)}
          isLoading={isLoading}
          isMyLicense={type === 'mine'}
        />
      ) : (
        <ContentEmptyPlaceholderState
          icon={<EmptyContentSVG />}
          title="No results found for Licenses."
          description="You can track and review all licensed content once you have placed orders. "
        />
      )}
    </Content>
  );
};
