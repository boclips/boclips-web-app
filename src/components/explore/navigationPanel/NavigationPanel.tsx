import React from 'react';
import NavigationPanelHeader from 'src/components/explore/navigationPanel/NavigationPanelHeader';
import NavigationPanelBody from 'src/components/explore/navigationPanel/NavigationPanelBody';
import { useOpenstaxMobileMenu } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';
import s from './style.module.less';

interface Props {
  theme: Theme;
}

export const NavigationPanel = ({ theme }: Props) => {
  const { isOpen } = useOpenstaxMobileMenu();
  const isDesktop = useMediaBreakPoint().type === 'desktop';

  return (
    <>
      {(isOpen || isDesktop) && (
        <div className={s.tocPanel}>
          <div className={s.sticky}>
            <NavigationPanelHeader theme={theme} />
            <NavigationPanelBody theme={theme} />
          </div>
        </div>
      )}
    </>
  );
};
