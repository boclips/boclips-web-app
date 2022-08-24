import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import NavigationPanelHeader from 'src/components/openstax/navigationPanel/NavigationPanelHeader';
import NavigationPanelBody from 'src/components/openstax/navigationPanel/NavigationPanelBody';
import { useOpenstaxMobileMenu } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

export const NavigationPanel = ({ book }: Props) => {
  const { isOpen } = useOpenstaxMobileMenu();
  const isDesktop = useMediaBreakPoint().type === 'desktop';

  return (
    <>
      {(isOpen || isDesktop) && (
        <div className={s.tocPanel}>
          <div className={s.sticky}>
            <NavigationPanelHeader book={book} />
            <NavigationPanelBody book={book} />
          </div>
        </div>
      )}
    </>
  );
};
