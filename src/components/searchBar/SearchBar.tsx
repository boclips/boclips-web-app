import React, { useEffect, useState } from 'react';
import SearchBar from '@boclips-ui/search-bar';
import { useNavigate } from 'react-router-dom';
import {
  convertToURLSearchParams,
  useLocationParams,
  useSearchQueryLocationParams,
} from 'src/hooks/useLocationParams';
import { useGetSuggestionsQuery } from 'src/hooks/api/suggestionsQuery';
import { v4 as uuidv4 } from 'uuid';
import { trackSearchCompletionsSuggested } from 'src/components/common/analytics/Analytics';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Constants } from 'src/AppConstants';
import { useDebounce } from 'src/hooks/useDebounce';
import s from './style.module.less';

interface Props {
  showIconOnly: boolean;
  onSearch?: (query: string) => void;
}

export const Search = ({ showIconOnly, onSearch }: Props) => {
  const navigate = useNavigate();
  const apiClient = useBoclipsClient();
  const [searchLocation] = useSearchQueryLocationParams();
  const query = useLocationParams().get('q');
  const [searchTerm, setSearchTerm] = useState(query);
  const [completionId, setCompletionId] = useState<string>(uuidv4());
  const [componentId] = useState<string>(uuidv4());

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: suggestions, isError: isSuggestionsError } =
    useGetSuggestionsQuery(debouncedSearchTerm);

  const emitSuggestionCompletionsEvent = (searchUrl?: string) => {
    trackSearchCompletionsSuggested(
      {
        completionId,
        componentId,
        searchQuery: searchTerm,
        impressions: suggestions?.phrases,
        searchUrl,
      },
      apiClient,
    );
    setCompletionId(uuidv4());
  };

  useEffect(() => {
    if (suggestions?.phrases && suggestions?.phrases.length > 0) {
      emitSuggestionCompletionsEvent();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [suggestions]);

  const handleSearch = (searchQuery: string, _, suggestionUsed: boolean) => {
    if (onSearch) {
      onSearch(searchQuery);
    }

    searchLocation.query = searchQuery;

    const params = convertToURLSearchParams(searchLocation);
    params.set('page', '1');
    params.delete('topics');

    if (suggestions?.phrases.length > 0 && suggestionUsed) {
      emitSuggestionCompletionsEvent(
        `${Constants.HOST}/videos?${params.toString()}`,
      );
    }

    return navigate({
      pathname: '/videos',
      search: params.toString(),
    });
  };

  const searchBarChanged = (newValue: string) => {
    setSearchTerm(newValue);
  };

  return (
    <div className={s.searchWrapper}>
      <SearchBar
        placeholder="Search for videos"
        iconOnlyButton={showIconOnly}
        onSearch={handleSearch}
        initialQuery={query}
        data-qa="search-input"
        onChange={searchBarChanged}
        suggestions={
          searchTerm &&
          searchTerm.length > 0 &&
          !isSuggestionsError &&
          suggestions?.phrases
        }
      />
    </div>
  );
};
