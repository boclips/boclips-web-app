import React, { useState } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Button from '@boclips-ui/button';
import ButtonIcon from 'src/resources/icons/pencil.svg';
import Tooltip from '@boclips-ui/tooltip';
import { Typography } from '@boclips-ui/typography';
import CloseButton from 'src/resources/icons/cross-icon.svg';
import s from './style.module.less';

interface Props {
  video: Video;
  currentTag: string;
  pedagogyTags: string[];
  setPedagogyTagCallback: (tag) => void;
}
export const EditPedagogyTagButton = ({
  video,
  currentTag,
  pedagogyTags,
  setPedagogyTagCallback,
}: Props) => {
  // eslint-disable-next-line no-console
  console.log(`video: ${video.id}`);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModalState = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onClick = (tag) => {
    toggleModalState();
    setPedagogyTagCallback(tag);
  };

  const modal = (
    <div role="dialog" className={s.playlistPanel}>
      <div className={s.header}>
        <Typography.Body weight="medium">Edit pedagogy tag</Typography.Body>
        <button type="button" onClick={() => setIsModalOpen(false)}>
          <CloseButton />
        </button>
      </div>

      <div className="d-flex">
        <select value={currentTag} onChange={(e) => onClick(e.target.value)}>
          {pedagogyTags.map((t) => (
            <option value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const button = (
    <Button
      className={s.editButton}
      iconOnly
      icon={<ButtonIcon />}
      name="Edit Tag"
      aria-label="edit tag"
      onClick={toggleModalState}
      width="40px"
      height="40px"
    />
  );

  return (
    <>
      <Tooltip text="Edit Pedagogy Tag">{button}</Tooltip>
      {isModalOpen && modal}
    </>
  );
};
