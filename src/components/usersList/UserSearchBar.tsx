import React, { useState } from 'react';
import SearchBar from '@boclips-ui/search-bar';
import s from './style.module.less';

interface Props {
  handleSearch: (query: string) => void;
}

export const UserSearch = ({ handleSearch }: Props) => {
  const [userSearchTerm, setUserUserSearchTerm] = useState('');

  return (
    <div className={s.searchWrapper}>
      <SearchBar
        placeholder="Search for users by email"
        onSearch={() => handleSearch(userSearchTerm)}
        iconOnlyButton={false}
        buttonText="Search Users"
        initialQuery=""
        data-qa="user-search-input"
        onChange={(value) => {
          if (!value) {
            handleSearch('');
          }
          setUserUserSearchTerm(value);
        }}
      />
    </div>
  );
};
