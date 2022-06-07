import React from 'react';
import SearchBar from '@boclips-ui/search-bar';
import { useHistory } from 'react-router-dom';
import {
  convertToURLSearchParams,
  useLocationParams,
  useSearchQueryLocationParams,
} from 'src/hooks/useLocationParams';
import s from './style.module.less';

interface Props {
  showIconOnly: boolean;
  onSearch?: (query: string) => void;
}

export const Search = ({ showIconOnly, onSearch }: Props) => {
  const history = useHistory();
  const [searchLocation] = useSearchQueryLocationParams();
  const query = useLocationParams().get('q');

  const handleSearch = (searchQuery: string) => {
    if (onSearch) {
      onSearch(searchQuery);
    }

    searchLocation.query = searchQuery;

    const params = convertToURLSearchParams(searchLocation);
    params.set('page', '1');
    params.delete('topics');

    return history.push({
      pathname: '/videos',
      search: params.toString(),
    });
  };

  return (
    <div className={s.searchWrapper}>
      <SearchBar
        placeholder="Search for videos"
        iconOnlyButton={showIconOnly}
        onSearch={handleSearch}
        initialQuery={query}
        data-qa="search-input"
      />
    </div>
  );
};
