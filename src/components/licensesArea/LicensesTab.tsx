import s from 'src/components/playlists/style.module.less';
import React, { useEffect, useState } from 'react';
import { Content } from '@radix-ui/react-tabs';
import LicensesArea from 'src/components/licensesArea/LicensesArea';
import { Hero as ContentEmptyPlaceholderState } from 'src/components/hero/Hero';
import EmptyContentSVG from 'src/resources/icons/empty-content.svg';
import { UseQueryResult } from '@tanstack/react-query';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import { useNavigate } from 'react-router-dom';
import { useLocationParams } from 'src/hooks/useLocationParams';
import {
  useGetUserQuery,
  useAccountBulkGetUsers,
} from 'src/hooks/api/userQuery';

const PAGE_SIZE = 10;

interface Props {
  value: string;
  getLicenses: (
    page: number,
    pageSize: number,
  ) => UseQueryResult<Pageable<LicensedContent>, unknown>;
}

export const LicensesTab = ({ value, getLicenses }: Props) => {
  const locationParams = useLocationParams();
  const navigator = useNavigate();
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(
    locationParams.get('page') ? Number(locationParams.get('page')) - 1 : 0,
  );
  const [userIds, setUserIds] = useState<string[]>([]);
  const { data: currentUser } = useGetUserQuery();
  const { data: userProfiles } = useAccountBulkGetUsers(
    currentUser?.account?.id,
    userIds,
  );

  useEffect(() => {
    locationParams.set('page', (currentPageNumber + 1).toString());
    navigator({
      search: locationParams.toString(),
    });
  }, [currentPageNumber]);

  const { data: licensedContent, isLoading } = getLicenses(
    currentPageNumber,
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
          onPageChange={(newPage) => setCurrentPageNumber(newPage)}
          isLoading={isLoading}
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
