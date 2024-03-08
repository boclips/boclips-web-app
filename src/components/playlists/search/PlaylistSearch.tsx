import SearchIcon from 'resources/icons/search-icon.svg';
import { InputText } from '@boclips-ui/input';
import React from 'react';

interface PlaylistSearchProps {
  setQuery: (query: string | undefined) => void;
}

const PlaylistSearch: React.FC<PlaylistSearchProps> = ({ setQuery }) => {
  return (
    <div className="mb-6 w-80">
      <InputText
        id="playlist-search"
        onChange={(text) => setQuery(text)}
        inputType="text"
        placeholder="Search for playlists"
        icon={<SearchIcon />}
        constraints={{ required: true }}
      />
    </div>
  );
};

export default PlaylistSearch;
