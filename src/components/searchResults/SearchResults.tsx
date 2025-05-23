import { SearchResultsSummary } from 'src/components/searchResults/SearchResultsSummary';
import React, { useState } from 'react';
import { VideoSearchResults } from 'boclips-api-client/dist/sub-clients/videos/model/VideoSearchResults';
import { VideosListView } from 'src/components/searchResults/VideosListView';
import VideoCardPlaceholder from '@boclips-ui/video-card-placeholder';
import { Helmet } from 'react-helmet';
import ViewButtons, {
  ViewType,
} from 'src/components/searchResults/ViewButtons';
import { VideosGridView } from 'src/components/searchResults/VideosGridView';
import { SearchTopics } from 'src/components/searchResults/SearchTopics';
import { FilterKey } from 'src/types/search/FilterKey';
import c from 'classnames';
import { NavigateToAssistantPrompt } from 'src/components/common/assistant/NavigateToAssistantPrompt';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import s from './styles.module.less';

interface Props {
  results?: VideoSearchResults;
  query: string;
  handlePageChange: (page: number) => void;
  currentPage: number;
  isFetching: boolean;
  handleFilterChange: (filterKey: FilterKey, values: string[]) => void;
}

export const SearchResults = ({
  results,
  query,
  handlePageChange,
  currentPage,
  isFetching,
  handleFilterChange,
}: Props) => {
  const [view, setView] = useState<ViewType>();
  const hasSearchTopics = results?.facets.topics.length > 0;

  const renderVideoCardList = () => {
    const placeholderView = results.page.map((video) => (
      <div
        className="mb-8"
        style={{ maxHeight: '265px' }}
        key={`placeholder-${video?.id}`}
        data-qa="video-card-placeholder"
      >
        <VideoCardPlaceholder />
      </div>
    ));

    if (!isFetching && !!results) {
      switch (view) {
        case 'LIST':
          return (
            <VideosListView
              videos={results.page}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              handleFilterChange={handleFilterChange}
              totalSearchResults={results.pageSpec?.totalElements}
            />
          );
        case 'GRID':
          return (
            <VideosGridView
              videos={results.page}
              currentPage={currentPage}
              handleFilterChange={handleFilterChange}
              handlePageChange={handlePageChange}
              totalSearchResults={results.pageSpec?.totalElements}
            />
          );
        default:
          return placeholderView;
      }
    }

    return placeholderView;
  };

  return (
    <>
      {query && <Helmet title={`Search results for ${query}`} />}
      <SearchTopics
        topics={results?.facets.topics}
        handleFilterChange={handleFilterChange}
      />
      <main
        tabIndex={-1}
        className={c('col-start-8 col-end-26 row-end-5', {
          'row-start-3': hasSearchTopics,
          'row-start-2': !hasSearchTopics,
        })}
      >
        <div className={s.assistantPromptContainer}>
          <NavigateToAssistantPrompt
            onNavigate={() =>
              AnalyticsFactory.pendo().trackAssistantEntryPointUsed(
                'searchResults',
              )
            }
          />
        </div>
        <div className="flex flex-row justify-between mb-2.5">
          <SearchResultsSummary
            count={results?.pageSpec?.totalElements}
            query={query}
          />
          <ViewButtons onChange={setView} />
        </div>
        {renderVideoCardList()}
      </main>
    </>
  );
};
