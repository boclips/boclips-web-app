import React from 'react';
import { TextButton } from 'src/components/common/textButton/TextButton';
import BackArrow from 'src/resources/icons/back-arrow.svg';
import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import CloseButtonIcon from 'src/resources/icons/cross-icon.svg';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { useHistory } from 'react-router-dom';
import { useOpenstaxMobileMenu } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

const NavigationPanelHeader = ({ book }: Props) => {
  const isNotDesktop = useMediaBreakPoint().type !== 'desktop';
  const history = useHistory();

  const { setIsOpen } = useOpenstaxMobileMenu();

  const goToExplorePage = () => {
    history.push('/explore/openstax');
  };

  return (
    <div data-qa="table of contents panel" className={s.tocHeaderWrapper}>
      {!isNotDesktop && (
        <TextButton
          onClick={goToExplorePage}
          text="Back"
          icon={<BackArrow />}
        />
      )}
      <div className={s.tocHeader}>
        <Typography.H1 size="sm" className="text-gray-900">
          {book.title}
        </Typography.H1>
        {isNotDesktop && (
          <Button
            text="Close"
            type="label"
            iconOnly
            icon={<CloseButtonIcon />}
            aria-label="Close the Table of contents"
            className={s.closeButton}
            onClick={() => {
              setIsOpen(false);
              window.scrollTo({ top: 0 });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NavigationPanelHeader;
