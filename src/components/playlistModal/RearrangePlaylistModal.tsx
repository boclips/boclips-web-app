import React from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Typography } from '@boclips-ui/typography';

interface Props {
  playlist: Collection;
  handleConfirm: (arg: any) => void;
  onCancel: () => void;
  confirmButtonText: string;
}

const RearrangeModal = ({
  handleConfirm,
  playlist,
  onCancel,
  confirmButtonText,
}: Props) => {
  console.log(handleConfirm, playlist);

  const onConfirm = () => {
    handleConfirm('');
  };

  return (
    <Bodal
      title="Rearrange videos"
      confirmButtonText={confirmButtonText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      dataQa="playlist-modal"
    >
      <Typography.Body as="span">
        Drag & drop video titles to put them in your desired order:
      </Typography.Body>
    </Bodal>
  );
};

export default RearrangeModal;
