import React, { useState } from 'react';
import { InputText } from '@boclips-ui/input';
import SearchIcon from '@resources/icons/search-icon.svg';
import s from './FilterSearch.module.less';

interface Props {
  placeholderText?: string;
  onSearch: (text) => void;
  id?: string;
}
export const FilterSearch = ({
  placeholderText = 'Search...',
  onSearch,
  id,
}: Props) => {
  const [searchText, setSearchText] = useState<string>('');
  const setText = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };
  return (
    <InputText
      defaultValue={searchText}
      height="40px"
      inputType="text"
      id={`search-filter-${id.replace(' ', '')}`}
      placeholder={placeholderText}
      constraints={{ required: false, minLength: 0 }}
      icon={<SearchIcon />}
      showLabelText={false}
      onChange={setText}
      allowClear
      className={s.filterInput}
    />
  );
};
