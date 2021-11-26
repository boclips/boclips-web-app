import React from 'react';
import SearchBar from '@boclips-ui/search-bar';
import { useHistory } from 'react-router-dom';
import {
  convertToURLSearchParams,
  useLocationParams,
  useSearchQueryLocationParams,
} from 'src/hooks/useLocationParams';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  size: 'big' | 'small' | 'responsive';
  showIconOnly: boolean;
  onSearch?: (query: string) => void;
}

export const Search = ({ size, showIconOnly, onSearch }: Props) => {
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

    return history.push({
      pathname: '/videos',
      search: params.toString(),
    });
  };

  return (
    <div
      className={c(s.searchWrapper, {
        [s.big]: size === 'big',
        [s.small]: size !== 'big',
        [s.responsive]: size === 'responsive',
      })}
    >
      <SearchBar
        placeholder="Search by topic or keyword"
        iconOnlyButton={showIconOnly}
        autocomplete={false}
        onSearch={handleSearch}
        initialQuery={query}
      />
    </div>
  );
};
