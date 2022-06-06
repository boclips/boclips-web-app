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

interface Props {
  results?: VideoSearchResults;
  query: string;
  handlePageChange: (page: number) => void;
  currentPage: number;
  isFetching: boolean;
}

export const SearchResults = ({
  results,
  query,
  handlePageChange,
  currentPage,
  isFetching,
}: Props) => {
  const [view, setView] = useState<ViewType>();

  const renderVideoCardList = () => {
    const placeholderView = results.page.map((video) => (
      <div
        className="mb-8"
        style={{ maxHeight: '265px' }}
        key={`placeholder-${video?.id}`}
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
              totalSearchResults={results.pageSpec?.totalElements}
            />
          );
        case 'GRID':
          return (
            <VideosGridView
              videos={results.page}
              currentPage={currentPage}
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
    <main tabIndex={-1} className="col-start-8 col-end-26">
      {query && <Helmet title={`Search results for ${query}`} />}
      <SearchTopics topics={results?.facets.topics} />
      <div className="flex flex-row justify-between">
        <SearchResultsSummary
          count={results?.pageSpec?.totalElements}
          query={query}
        />
        <ViewButtons onChange={setView} />
      </div>
      {renderVideoCardList()}
    </main>
  );
};
