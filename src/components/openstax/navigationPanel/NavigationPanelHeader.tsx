import React from 'react';
import { TextButton } from 'src/components/common/textButton/TextButton';
import BackArrow from 'src/resources/icons/back-arrow.svg';
import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import CloseButtonIcon from 'src/resources/icons/cross-icon.svg';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { useNavigate } from 'react-router-dom';
import { useOpenstaxMobileMenu } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import { BookLogo } from 'src/components/openstax/bookLogo/BookLogo';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

const NavigationPanelHeader = ({ book }: Props) => {
  const isNotDesktop = useMediaBreakPoint().type !== 'desktop';
  const navigate = useNavigate();

  const { setIsOpen } = useOpenstaxMobileMenu();

  const goToSparksPage = () => {
    navigate('/sparks/openstax');
  };

  return (
    <section
      data-qa="table of contents panel"
      className={s.tocHeaderWrapper}
      aria-labelledby="navigation-header"
    >
      {!isNotDesktop && (
        <TextButton onClick={goToSparksPage} text="Back" icon={<BackArrow />} />
      )}
      <div className={s.tocHeader}>
        {!isNotDesktop && <BookLogo book={book} className="mr-4" />}
        <Typography.H1
          size="sm"
          className="text-gray-900"
          id="navigation-header"
          aria-label={`${book.title} navigation`}
        >
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
    </section>
  );
};

export default NavigationPanelHeader;
