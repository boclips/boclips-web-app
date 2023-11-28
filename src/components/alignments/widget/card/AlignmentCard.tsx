import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Provider } from 'boclips-api-client/dist/sub-clients/alignments/model/provider/Provider';
import { useNavigate } from 'react-router-dom';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import s from './alignmentCard.module.less';

interface Props {
  provider: Provider;
}

const AlignmentCard = ({ provider }: Props) => {
  const navigate = useNavigate();
  const { features, isLoading } = useFeatureFlags();

  const handleOnClick = () => {
    if (features?.ALIGNMENTS_RENAMING) {
      navigate(`/alignments/${provider.navigationPath}`);
      return;
    }
    navigate(`/sparks/${provider.navigationPath}`);
  };

  return (
    !isLoading && (
      <button
        aria-label={`Provider ${provider.name}`}
        type="button"
        key={provider.name}
        onClick={handleOnClick}
        className={s.alignmentCard}
      >
        <div>
          <img
            alt={`${provider.name} logo`}
            src={provider.logoUrl}
            className={s.alignmentCardLogo}
          />
          <Typography.H1
            size={{ mobile: 'md', tablet: 'md', desktop: 'lg' }}
            className="mb-2 text-left"
          >
            {provider.name}
          </Typography.H1>
        </div>
        <Typography.Body className={s.alignmentCardDescription}>
          {provider.description}
        </Typography.Body>
      </button>
    )
  );
};

export default AlignmentCard;
