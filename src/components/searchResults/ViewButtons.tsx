import React, { useEffect, useState } from 'react';
import GridViewIcon from 'resources/icons/grid-view-icon.svg';
import ListViewIcon from 'resources/icons/list-view-icon.svg';
import Button from '@boclips-ui/button';
import Tooltip from '@boclips-ui/tooltip';
import s from './styles.module.less';

interface Props {
  onChange: (name: ViewType) => void;
}
export declare type ViewType = 'LIST' | 'GRID';
export const VIEW_TYPE_ITEM = 'view-type';

const ViewButtons = ({ onChange }: Props) => {
  const [chosenViewType, setChosenViewType] = useState<ViewType>();
  useEffect(() => {
    const viewType =
      localStorage.getItem(VIEW_TYPE_ITEM) === 'GRID' ? 'GRID' : 'LIST';
    changeViewTo(viewType);
    // eslint-disable-next-line
  }, []);

  const changeViewTo = (view: ViewType) => {
    setChosenViewType(view);
    localStorage.setItem(VIEW_TYPE_ITEM, view);
    onChange(view);
  };

  return (
    <span className="flex flex-row">
      <div className={`${s.viewButton} mr-1`}>
        <Tooltip text="List view">
          <Button
            aria-label="list view"
            data-qa="list-view-button"
            frameBorder={undefined}
            onClick={() => changeViewTo('LIST')}
            iconOnly
            icon={<ListViewIcon />}
            height="32px"
            width="32px"
            type={chosenViewType === 'LIST' ? undefined : 'outline'}
          />
        </Tooltip>
      </div>
      <div className={s.viewButton}>
        <Tooltip text="Grid view">
          <Button
            aria-label="grid view"
            data-qa="grid-view-button"
            onClick={() => changeViewTo('GRID')}
            iconOnly
            icon={<GridViewIcon />}
            height="32px"
            width="32px"
            type={chosenViewType === 'GRID' ? undefined : 'outline'}
          />
        </Tooltip>
      </div>
    </span>
  );
};

export default ViewButtons;
