import React from 'react';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import List from 'antd/lib/list';
import { UsersListItem } from 'src/components/usersList/UsersListItem';
import { useFindAccountUsers, useGetUserQuery } from 'src/hooks/api/userQuery';

const SKELETON_LIST_ITEMS = new Array(3).fill('');
export const UsersList = () => {
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();
  const { data: accountUsers, isLoading: isLoadingAccountUsers } =
    useFindAccountUsers(user?.account?.id, 0, 1000);

  const isSkeletonLoading = isLoadingUser || isLoadingAccountUsers;

  return (
    <List
      className="w-full"
      itemLayout="vertical"
      size="large"
      dataSource={isSkeletonLoading ? SKELETON_LIST_ITEMS : accountUsers}
      renderItem={(accountUser: AccountUser) => (
        <UsersListItem user={accountUser} isLoading={isSkeletonLoading} />
      )}
    />
  );
};
