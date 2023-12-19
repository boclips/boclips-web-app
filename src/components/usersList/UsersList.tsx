import React from 'react';
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
import s from 'src/components/common/pagination/pagination.module.less';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

const SKELETON_LIST_ITEMS = new Array(3).fill('');
const PAGE_SIZE = 25;

interface Props {
  onEditUser: (user: AccountUser) => void;
  onRemoveUser: (user: AccountUser) => void;
}

export const UsersList = ({ onEditUser, onRemoveUser }: Props) => {
  const [currentPageNumber, setCurrentPageNumber] = React.useState(0);

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();
  const { data: accountUsersPage, isLoading: isLoadingAccountUsers } =
    useFindAccountUsers(user?.account?.id, currentPageNumber, PAGE_SIZE);
  const { data: account, isLoading: isLoadingAccount } = useGetAccount(
    user?.account?.id,
  );

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

  return (
    <List
      className="w-full"
      itemLayout="vertical"
      size="large"
      dataSource={isSkeletonLoading ? SKELETON_LIST_ITEMS : accountUsers}
      renderItem={(accountUser: AccountUser) => (
        <UsersListItem
          user={accountUser}
          isLoading={isSkeletonLoading}
          onEdit={() => onEditUser(accountUser)}
          canEdit={canEditUser}
          onRemove={() => onRemoveUser(accountUser)}
          canRemove={canRemoveUser}
          accountStatus={account?.status}
        />
      )}
      pagination={{
        total: accountUsersPage?.pageSpec.totalElements,
        className: c(s.pagination, {
          [s.paginationEmpty]: accountUsers.length === 0,
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
  );
};
