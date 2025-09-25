import React, { useState } from 'react';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import List from 'antd/lib/list';
import { UsersListItem } from 'src/components/usersList/UsersListItem';
import {
  useFindAccountUsers,
  useGetAccount,
  useGetUserQuery,
} from 'src/hooks/api/userQuery';
import Pagination from '@boclips-ui/pagination';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import c from 'classnames';
import p from 'src/components/common/pagination/pagination.module.less';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { FeatureGate } from 'src/components/common/FeatureGate';
import useCurrentProduct from 'src/hooks/useCurrentProduct';
import { UserSearch } from 'src/components/usersList/UserSearchBar';
import s from './style.module.less';

const SKELETON_LIST_ITEMS = new Array(3).fill('');
const PAGE_SIZE = 25;

interface Props {
  onEditUser: (user: AccountUser) => void;
  onRemoveUser: (user: AccountUser) => void;
}

export const UsersList = ({ onEditUser, onRemoveUser }: Props) => {
  const [currentPageNumber, setCurrentPageNumber] = React.useState(0);
  const [query, setQuery] = useState('');

  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();
  const { data: accountUsersPage, isLoading: isLoadingAccountUsers } =
    useFindAccountUsers(user?.account?.id, currentPageNumber, PAGE_SIZE, query);
  const { data: account, isLoading: isLoadingAccount } = useGetAccount(
    user?.account?.id,
  );
  const product = useCurrentProduct();

  const canEditUser =
    !isLoadingAccount &&
    !isLoadingUser &&
    account?.status === AccountStatus.ACTIVE;

  const canRemoveUser = !isLoadingAccount && !isLoadingUser;

  const accountUsers = accountUsersPage?.page || [];
  const pageSpec = accountUsersPage?.pageSpec;

  const isSkeletonLoading = isLoadingUser || isLoadingAccountUsers;

  const currentBreakpoint = useMediaBreakPoint();
  const mobileView = currentBreakpoint.type === 'mobile';

  const itemRender = React.useCallback(
    (page, type) => {
      return (
        <Pagination
          buttonType={type}
          page={page}
          mobileView={mobileView}
          currentPage={currentPageNumber + 1}
          totalItems={pageSpec?.totalPages}
        />
      );
    },
    [accountUsersPage, mobileView],
  );

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPageNumber(0);
  };

  return (
    <FeatureGate fallback={null} linkName="accountUsers">
      <div className={s.userListContainer}>
        <div className={s.userSearchBar}>
          <UserSearch handleSearch={handleSearch} />
        </div>
        <List
          className={s.userList}
          itemLayout="vertical"
          size="large"
          dataSource={isSkeletonLoading ? SKELETON_LIST_ITEMS : accountUsers}
          renderItem={(accountUser: AccountUser) => (
            <UsersListItem
              user={accountUser}
              product={product}
              isLoading={isSkeletonLoading}
              onEdit={() => onEditUser(accountUser)}
              canEdit={canEditUser}
              onRemove={() => onRemoveUser(accountUser)}
              canRemove={canRemoveUser}
              displayAccount={
                !isLoadingAccount && account.subAccounts?.length > 0
              }
              iconOnlyButtons={isMobileView}
            />
          )}
          pagination={{
            total: accountUsersPage?.pageSpec.totalElements,
            className: c(p.pagination, {
              [p.paginationEmpty]: accountUsers.length === 0,
            }),
            hideOnSinglePage: true,
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            onChange: (page) => setCurrentPageNumber(page - 1),
            current: currentPageNumber + 1,
            showLessItems: mobileView,
            prefixCls: 'bo-pagination',
            itemRender,
          }}
        />
      </div>
    </FeatureGate>
  );
};
