import React, { useState } from 'react';
import c from 'classnames';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import s from './DrawerVideoSearch.module.less';

interface Props {
  onSectionCreated: () => void;
}

export const DrawerManageSection = ({ onSectionCreated }: Props) => {
  const { dispatch } = useMagicPlaylistContext();
  const [sectionTitle, setSectionTitle] = useState('');

  const createNewSection = (title) => {
    dispatch({
      action: 'add-section',
      text: title,
    });
    setSectionTitle('');
    onSectionCreated();
  };

  return (
    <div className={c(s.drawerSearchResults)}>
      <input
        type="text"
        value={sectionTitle}
        onChange={(e) => setSectionTitle(e.target.value)}
      />
      <button type="button" onClick={() => createNewSection(sectionTitle)}>
        Add section
      </button>
    </div>
  );
};
