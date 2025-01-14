import React, { useEffect, useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { InputText } from '@boclips-ui/input';
import { CollectionAssetId } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';

interface NoteModalProps {
  onCancel: () => void;
  title: string;
  assetId: CollectionAssetId;
  initialNote: string;
  onConfirm: (assetId: CollectionAssetId, note: string) => void;
}

const NoteModal = ({
  onCancel,
  title,
  assetId,
  initialNote,
  onConfirm,
}: NoteModalProps) => {
  const [note, setNote] = useState<string>(initialNote);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.removeAttribute('tabIndex');
    }
    return () => {
      if (main) main.setAttribute('tabIndex', '-1');
    };
  }, []);

  const handleNoteChange = (value: string) => {
    setNote(value);
  };

  const handleConfirm = () => {
    onConfirm(assetId, note);
  };

  return (
    <Bodal
      onCancel={onCancel}
      title={title}
      displayCancelButton
      confirmButtonText="Set note"
      onConfirm={handleConfirm}
    >
      <div className="justify-center mb-10">
        <InputText
          id="playlist-asset-note"
          placeholder="Add note"
          constraints={{ minLength: 0 }}
          onChange={handleNoteChange}
          inputType="textarea"
          defaultValue={initialNote}
          height="12rem"
        />
      </div>
    </Bodal>
  );
};

export default NoteModal;
