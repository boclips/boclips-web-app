import React, { useState } from 'react';
import { BoInputText } from 'src/components/common/input/BoInputText';
import SearchIcon from 'resources/icons/search-icon.svg';

interface Props {
  placeholderText?: string;
  onSearch: (text) => void;
}
export const FilterSearch = ({
  placeholderText = 'Search...',
  onSearch,
}: Props) => {
  const [searchText, setSearchText] = useState<string>('');
  const setText = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };
  return (
    <BoInputText
      defaultValue={searchText}
      height="40px"
      inputType="text"
      id="search-filter"
      placeholder={placeholderText}
      icon={<SearchIcon />}
      showLabelText={false}
      onChange={setText}
      allowClear
    />
  );
};
