import { SearchResultsSummary } from 'src/components/searchResults/SearchResultsSummary';
import React from 'react';
import { VideoSearchResults } from 'boclips-api-client/dist/sub-clients/videos/model/VideoSearchResults';
import { VideoCardList } from 'src/components/searchResults/VideoCardList';
import VideoCardPlaceholder from '@boclips-ui/video-card-placeholder';
import { Helmet } from 'react-helmet';

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
  const renderVideoCardList = () => {
    switch (!isFetching && !!results) {
      case true:
        return (
          <VideoCardList
            videos={results.page}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalSearchResults={results.pageSpec?.totalElements}
          />
        );
      default:
        return results.page.map((video) => (
          <div
            className="mb-8"
            style={{ maxHeight: '265px' }}
            key={`placeholder-${video?.id}`}
          >
            <VideoCardPlaceholder />
          </div>
        ));
    }
  };

  return (
    <main tabIndex={-1} className="col-start-8 col-end-26">
      {query && <Helmet title={`Search results for ${query}`} />}
      <SearchResultsSummary
        count={results?.pageSpec?.totalElements}
        query={query}
      />

      {renderVideoCardList()}
    </main>
  );
};
