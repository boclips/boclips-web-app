import { Typography } from 'boclips-ui';
import React, { useState } from 'react';
import { handleEnterKeyEvent } from '@src/services/handleKeyEvent';
import InfoSVG from '@src/resources/icons/info.svg';
import BestForModal from '@src/components/filterPanel/filter/modals/BestForModal';
import c from 'classnames';
import FilterArrow from '../../../resources/icons/blue-arrow.svg';
import s from './filterHeader.module.less';

interface Props {
  ariaId: string;
  text: string;
  filterIsOpen: boolean;
  toggleFilter: () => void;
  showExplanation?: boolean;
}

export const FilterHeader = ({
  text,
  filterIsOpen,
  toggleFilter,
  ariaId,
  showExplanation,
}: Props) => {
  const [open, setOpen] = useState(false);

  const getAdditionalInfoModal = (filterName: string) => {
    switch (filterName) {
      case 'Best for': {
        return <BestForModal setOpen={setOpen} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className={c(
          'px-4 text-gray-800 flex items-center cursor-pointer active:border-none justify-between w-full',
        )}
        aria-expanded={filterIsOpen}
        aria-controls={ariaId}
        aria-label={`${text} filter panel`}
        onClick={toggleFilter}
        onKeyPress={(event) => handleEnterKeyEvent(event, toggleFilter)}
      >
        <Typography.Body as="div" weight="medium" className={s.panelText}>
          {text}

          {showExplanation && (
            <InfoSVG
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              data-qa="best-for-info-button"
            />
          )}
        </Typography.Body>

        <FilterArrow
          className={`${filterIsOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      {open && getAdditionalInfoModal(text)}
    </>
  );
};
