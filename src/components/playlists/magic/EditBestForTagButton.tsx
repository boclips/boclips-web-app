import React, { useState } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Button from '@boclips-ui/button';
import ButtonIcon from 'src/resources/icons/pencil.svg';
import Tooltip from '@boclips-ui/tooltip';
import { Typography } from '@boclips-ui/typography';
import CloseButton from 'src/resources/icons/cross-icon.svg';
import { BestForTag } from 'boclips-api-client/dist/sub-clients/bestForTags/model/BestForTag';
import s from './style.module.less';

interface Props {
  video: Video;
  currentTag: BestForTag;
  tags: BestForTag[];
  setTagCallback: (tag) => void;
}
export const EditBestForTagButton = ({
  video,
  currentTag,
  tags,
  setTagCallback,
}: Props) => {
  // eslint-disable-next-line no-console
  console.log(`video: ${video.id}`);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModalState = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onClick = (tagId) => {
    toggleModalState();
    const selected = tags.filter((t) => t.id === tagId);
    setTagCallback(selected[0]);
  };

  return (
    <>
      <Tooltip text="Edit Best For Tag">
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
      </Tooltip>
      {isModalOpen && (
        <div role="dialog" className={s.modal}>
          <div className={s.header}>
            <Typography.Body weight="medium">Edit Best For tag</Typography.Body>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              <CloseButton />
            </button>
          </div>

          <div className={s.select}>
            <select
              value={currentTag.id}
              onChange={(e) => onClick(e.target.value)}
            >
              {tags.map((t) => (
                <option value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};
