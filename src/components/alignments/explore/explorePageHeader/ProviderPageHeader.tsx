import React from 'react';
import { Typography } from 'boclips-ui';
import { useAlignmentProvider } from '@src/components/common/providers/AlignmentContextProvider';
import { TextButton } from '@src/components/common/textButton/TextButton';
import BackArrow from '@src/resources/icons/back-arrow.svg';
import { useNavigate } from 'react-router-dom';
import s from './style.module.less';

const ProviderPageHeader = () => {
  const navigate = useNavigate();
  const provider = useAlignmentProvider();

  const goToAlignments = () => {
    navigate('/alignments');
  };

  return (
    <section
      className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 mt-2 flex flex-col"
      aria-labelledby="page-header"
    >
      <TextButton onClick={goToAlignments} text="Back" icon={<BackArrow />} />
      <div className="flex flex-col md:flex-row">
        <div className="flex grow flex-col space-y-2 md:space-y-4 mb-4">
          <Typography.H1 size="lg" id="page-header">
            Our {provider.name} collection
          </Typography.H1>

          <Typography.H2 size="xs" weight="regular">
            {provider.description}
          </Typography.H2>
        </div>
        <img
          alt={`${provider.name} logo`}
          className={s.providerLogo}
          src={provider.logoUrl}
        />
      </div>
    </section>
  );
};

export default ProviderPageHeader;
