import React from 'react';
import Button from '@boclips-ui/button';

interface Props {
  title: string;
  link: string;
}

export const PlaylistShareButton = ({ title, link }: Props) => {
  const handleClick = () => {
    navigator.clipboard.writeText(link);
  };

  return <Button onClick={handleClick} text={title} />;
};
