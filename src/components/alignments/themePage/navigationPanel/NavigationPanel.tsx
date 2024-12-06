import React from 'react';
import NavigationPanelHeader from '@components/alignments/themePage/navigationPanel/NavigationPanelHeader';
import NavigationPanelBody from '@components/alignments/themePage/navigationPanel/NavigationPanelBody';
import { useThemeMobileMenuContext } from '@components/common/providers/ThemeMobileMenuProvider';
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
