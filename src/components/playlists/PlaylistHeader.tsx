import React from 'react';

interface Props {
  title: string;
}

const PlaylistHeader = ({ title }: Props) => {
  return (
    <h2 className="grid-row-start-2 grid-row-end-2 col-start-2 col-end-26">
      {title}
    </h2>
  );
};

export default PlaylistHeader;
