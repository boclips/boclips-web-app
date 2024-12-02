import React from 'react';
import NavigationPanelHeader from '@src/components/alignments/themePage/navigationPanel/NavigationPanelHeader';
import NavigationPanelBody from '@src/components/alignments/themePage/navigationPanel/NavigationPanelBody';
import { useThemeMobileMenuContext } from '@src/components/common/providers/ThemeMobileMenuProvider';
import { useMediaBreakPoint } from 'boclips-ui';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import s from './style.module.less';

interface Props {
  theme: Theme;
}

export const NavigationPanel = ({ theme }: Props) => {
  const { isOpen } = useThemeMobileMenuContext();
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
