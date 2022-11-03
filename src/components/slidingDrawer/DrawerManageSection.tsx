import React, { useState } from 'react';
import c from 'classnames';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import { BoInputText } from 'src/components/common/input/BoInputText';
import Button from '@boclips-ui/button';
import s from './SlidingDrawer.module.less';

interface Props {
  onSectionCreated: () => void;
  onClose: () => void;
}

export const DrawerManageSection = ({ onSectionCreated, onClose }: Props) => {
  const { dispatch } = useMagicPlaylistContext();
  const [sectionTitle, setSectionTitle] = useState('');
  const [titleError, setTitleError] = useState(false);

  const hasErrors = () => {
    let hasErr = false;

    if (sectionTitle == null || sectionTitle.trim() === '') {
      setTitleError(true);
      hasErr = true;
    }

    return hasErr;
  };

  const createNewSection = (title) => {
    if (!hasErrors()) {
      setTitleError(false);

      dispatch({
        action: 'add-section',
        text: title.trim(),
      });
      setSectionTitle('');
      onSectionCreated();
    }
  };

  return (
    <div className={c(s.drawerSearchResults)}>
      <div className="pb-6">
        <BoInputText
          id="section-title"
          labelText="Section title"
          placeholder="Add section title..."
          constraints={{ required: true, minLength: 1 }}
          onChange={(input) => setSectionTitle(input)}
          isError={titleError}
          errorMessage="Section title is required"
          inputType="text"
          height="48px"
        />
      </div>
      <div className={s.buttons}>
        <Button
          text="Close"
          type="label"
          aria-label="Close the drawer"
          onClick={onClose}
        />
        <Button
          onClick={() => createNewSection(sectionTitle)}
          text="Add section"
          aria-label="Add section"
          width="120px"
          height="40px"
        />
      </div>
    </div>
  );
};
