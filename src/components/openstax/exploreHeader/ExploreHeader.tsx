import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import s from './style.module.less';

const ExploreHeader = () => {
  const provider = useAlignmentProvider();
  return (
    <section
      className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 mt-2 flex flex-col md:flex-row"
      aria-labelledby="page-header"
    >
      <div className="flex grow flex-col space-y-2 md:space-y-4 mb-4">
        <Typography.H1 size="lg" id="page-header">
          {provider.header}
        </Typography.H1>

        <Typography.H2 size="xs" weight="regular">
          {provider.description}
        </Typography.H2>
      </div>
      <img
        alt={provider.imgAltText}
        className={s.providerLogo}
        src={provider.logoUrl}
      />
    </section>
  );
};

export default ExploreHeader;
